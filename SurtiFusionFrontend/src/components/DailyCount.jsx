// src/components/DailyCount.jsx

import React, { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";
import "react-quill/dist/quill.snow.css";
import { useReactToPrint } from "react-to-print";
import { daily } from "../services/orders";
import api from "../services/api";
import { useNotification } from "../context/NotificationContext";
const STORAGE_KEY = "surtifusion_packing_state";
export default function DailyCount() {
  const notify = useNotification();
  const printRef = useRef();

  // packing workflow
  const [distinctRows, setDistinctRows] = useState([]);
  const [combinedRows, setCombinedRows] = useState([]);
  const [remaining, setRemaining] = useState([]);
  const [packing, setPacking] = useState(false);
  const [selectionModel, setSelectionModel] = useState([]);
  const [templateHtml, setTemplateHtml] = useState("");
  const previewCustomerRef = useRef(null);
  const [previewCustomer, setPreviewCustomer] = useState(null);
  // scanner input
  const [scanValue, setScanValue] = useState("");
  const scanInputRef = useRef(null);
  // load tiffins & saved template
  useEffect(() => {
    let pc = null;
    daily()
      .then((res) => {
        const tempRows = [];
        let idCounter = 1;

        res.data.forEach((item) => {
          const order = item.order || {};
          const plan = item.meal_plan || {};
          const customer = order.customer || {};
          const quantity = item.quantity || 1;

          // Create `quantity` separate entries, each qty=1
          for (let i = 0; i < quantity; i++) {
            tempRows.push({
              id: idCounter++, // Unique ID for each row
              plan: plan.name || plan.planname || "",
              customer: customer.name || "",
              address: customer.address || "",
              qty: 1, // Always 1 now
            });
          }
        });

        setDistinctRows(tempRows);
        const data = res.data.map((item, idx) => {
          const o = item.order;
          const p = item.meal_plan;
          const c = o.customer || {};
          return {
            id: idx + 1,
            plan: p?.name || p?.planname,
            customer: c.name,
            address: c.address,
            qty: item.quantity,
          };
        });
        setCombinedRows(data);
        if (data.length) {
          setPreviewCustomer(data[0]);
          pc = data[0];
        }
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            // Ensure that stored “remaining” matches today’s rows by ID
            const validRemaining = parsed.remaining.filter((rid) =>
              tempRows.some((r) => r.id === rid.id)
            );
            setRemaining(validRemaining);
            setSelectionModel(parsed.selectionModel || []);
            setPacking(parsed.packing || false);
            // Focus scanner input if packing was in progress
            if (parsed.packing) {
              setTimeout(() => scanInputRef.current?.focus(), 50);
            }
          } catch {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
        api
          .get("/label-template")
          .then(({ data }) => {
            const content = data.content || "";
            setTemplateHtml(data.content || "");
            // Also build the initial “live preview”
            if (previewCustomerRef.current) {
              previewCustomerRef.current.innerHTML = builPreviewCustomerHtml(
                content,
                pc
              );
            }
          })
          .catch((err) => {
            console.error(err);
            notify({ message: "Failed to load template", severity: "error" });
          });
      })
      .catch((err) => notify({ message: err.message, severity: "error" }));
  }, [notify]);

  useEffect(() => {
    // Only store if we are in packing mode or if there is a leftover to resume
    if (packing || remaining.length > 0) {
      const toStore = {
        packing,
        remaining,
        selectionModel,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } else {
      // no packing & no leftovers → clear storage
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [packing, remaining, selectionModel]);

  function builPreviewCustomerHtml(html, previewCustomer) {
    // 1) Substitute “SAMPLE_NAME”, “SAMPLE_ADDRESS”, and “SAMPLE_PLAN”
    let filled = html
      .replace(/{{customerName}}/g, previewCustomer.customer)
      .replace(/{{customerAddress}}/g, previewCustomer.address)
      .replace(/{{mealPlan}}/g, previewCustomer.plan);

    // 2) Compute the QR payload & URL (5mm × 5mm)
    const qrPayload = `${previewCustomer.customer}-${previewCustomer.plan}`;
    const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(
      qrPayload
    )}&size=3&margin=3`;

    // 3) Replace only the <img id="qr-placeholder" …> node with actual QR
    const placeholderRegex =
      /<img[^>]*src=(["'])(?:https:\/\/quickchart\.io\/)[^>]*>/gi;
    filled = filled.replace(
      placeholderRegex,
      `<img
        id="qr-placeholder"
        src="${qrUrl}"
        style="
          position:absolute;
          bottom:2mm;
          left:2mm;
          width:13mm;
          height:13mm;
        "
        alt="QR code"
      />`
    );
    return `
      <div class="label" >
  <div class="ql-container ql-snow">
    <div class="ql-editor">${filled}</div>
  </div>
</div>
    `;
  }
  // packing handlers
  const handleStart = () => {
    setRemaining(distinctRows);
    setSelectionModel([]);
    setPacking(true);
    setTimeout(() => {
      scanInputRef.current?.focus();
    }, 100);
  };
  const handlePause = () => {
    // Simply turn off packing mode; state is already stored by useEffect
    setPacking(false);
    notify({
      message: "Packing paused. You can resume later.",
      severity: "info",
    });
  };
  const handleResume = () => {
    setPacking(true);
    setTimeout(() => {
      scanInputRef.current?.focus();
    }, 50);
  };
  const handleEnd = () => {
    const packed = new Set(selectionModel);
    const leftover = remaining.filter((r) => !packed.has(r.id));
    if (leftover.length === 0) {
      notify({ message: "Done packing!", severity: "success" });
      setPacking(false);
      setRemaining([]);
      setSelectionModel([]);
      localStorage.removeItem(STORAGE_KEY);
    } else {
      notify({
        message: "These tiffins remain – please pack them and try again.",
        severity: "warning",
      });
      setRemaining(leftover);
      setSelectionModel([]);
      setPacking(false);
      setTimeout(() => scanInputRef.current?.focus(), 50);
    }
  };
  const handleScanKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const text = scanValue.trim();
      if (!text) {
        setScanValue("");
        return;
      }
      // expected format: "CustomerName-MealPlan"
      const hyphenIndex = text.indexOf("-");
      if (hyphenIndex < 1) {
        notify({
          message: `Invalid scan format: "${text}"`,
          severity: "error",
        });
        setScanValue("");
        return;
      }

      const custName = text.slice(0, hyphenIndex).trim();
      const mealPlan = text.slice(hyphenIndex + 1).trim();

      // find the matching row in `remaining`:
      const match = remaining.find(
        (r) => r.customer === custName && r.plan === mealPlan
      );
      if (!match) {
        notify({
          message: `No matching tiffin found for "${custName} – ${mealPlan}"`,
          severity: "error",
        });
        setScanValue("");
        return;
      }

      // 3a) check that ID → mark as packed (add to selectionModel)
      setSelectionModel((prev) => {
        if (!prev.includes(match.id)) {
          return [...prev, match.id];
        }
        return prev;
      });

      // 3b) remove it from remaining so it disappears immediately
      const newRemaining = remaining.filter((r) => r.id !== match.id);
      setRemaining(newRemaining);

      notify({
        message: `Packed: ${custName} – ${mealPlan}`,
        severity: "success",
      });
      setScanValue("");
      if (newRemaining.length === 0) {
        setTimeout(() => {
          notify({
            message: "Done with packing for today!",
            severity: "success",
          });
          setPacking(false);
          setSelectionModel([]);
          setRemaining([]);
          localStorage.removeItem(STORAGE_KEY);
        }, 100);
      } else {
        // keep focus on scanner for next
        setTimeout(() => scanInputRef.current?.focus(), 150);
      }
    }
  };
  const triggerPrint = useReactToPrint({
    content: () => printRef.current,
    contentRef: printRef,
    pageStyle: `
    @page {size: 4in 2in;margin: 0mm }
    body { margin:0mm; padding: 0mm }
   
    .label {
      border: none !important;
      width: 4in; height: 2in;
      box-shadow: none !important;
      overflow: hidden;
    }
    .ql-container {
      border: none !important;
      box-shadow: none !important;
      overflow: hidden;
    }
    .ql-editor {
      margin: 0;
      border: none !important;
      padding: 0 !important;
    }
  `,
  });
  // build & print
  const handlePrintLabels = async () => {
    // fetch latest template
    let tpl = "";
    try {
      const { data } = await api.get("/label-template");
      tpl = data.content || "";
    } catch (err) {
      return notify({ message: "Failed to load template", severity: "error" });
    }
    if (!tpl) {
      return notify({
        message: "Save your label template first.",
        severity: "warning",
      });
    }
    if (!distinctRows || distinctRows.length === 0) {
      notify({ message: "No labels to print", severity: "warning" });
      return "";
    }
    // generate HTML
    const html = Array.from(distinctRows.entries())
      .map((row) => {
        const { customer, address, plan } = row[1];
        let filled = tpl
          .replace(/{{customerName}}/g, customer)
          .replace(/{{customerAddress}}/g, address)
          .replace(/{{mealPlan}}/g, plan);
        let qrText = `${customer}-${plan}`;
        // qrText = qrText.replace(/ /g, "%20");
        console.log(qrText);
        const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(
          qrText
        )}&size=3&margin=3`;

        filled = filled.replace(
          /<img[^>]*src=(["'])(?:https:\/\/quickchart\.io\/)[^>]*>/i,
          `<img id="qr-placeholder" 
            src="${qrUrl}"
            style="
              position:absolute;
              bottom:2mm;
              left:2mm;
              width:13mm;
              height:13mm;
            "
            alt="QR code"
          />`
        );
        return `
<div class="label" >
  <div class="ql-container ql-snow">
    <div class="ql-editor">${filled}</div>
  </div>
</div>`;
      })
      .join("\n");

    // inject & fire
    if (printRef.current) {
      printRef.current.innerHTML = html;
      triggerPrint();
    }
  };
  const handleCustomerChange = (c) => {
    setPreviewCustomer(c);
    if (previewCustomerRef.current) {
      previewCustomerRef.current.innerHTML = builPreviewCustomerHtml(
        templateHtml,
        c
      );
    }
  };
  // grid + preview
  const displayRows = packing ? remaining : distinctRows;
  const columns = [
    { field: "plan", headerName: "Meal Plan", width: 200 },
    { field: "customer", headerName: "Customer", width: 180 },
    { field: "qty", headerName: "Quantity", width: 100 },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Typography variant="h6" mb={1}>
        Today's Tiffin Counts
      </Typography>

      {/* Start / Pause / End / Resume Packing Buttons */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {!packing && !localStorage.getItem(STORAGE_KEY) && (
          // No active pack state → “Start Packing”
          <Button variant="contained" onClick={handleStart}>
            Start Packing
          </Button>
        )}

        {packing && (
          // If actively packing → “Pause Packing” and “End Packing”
          <>
            <Button variant="contained" color="warning" onClick={handlePause}>
              Pause Packing
            </Button>
            <Button variant="contained" color="secondary" onClick={handleEnd}>
              End Packing
            </Button>
          </>
        )}

        {/* If there's a paused state in storage, show “Resume Packing” */}
        {!packing && localStorage.getItem(STORAGE_KEY) && (
          <Button variant="contained" color="success" onClick={handleResume}>
            Resume Packing
          </Button>
        )}

        <Button variant="outlined" onClick={handlePrintLabels}>
          Print Labels
        </Button>
      </Stack>
      {/* Hidden container */}
      <div style={{ display: "none" }}>
        <div ref={printRef} />
      </div>

      {/* ── Hidden “scanner” input; auto–focused when packing starts ────────────── */}
      {packing && (
        <TextField
          inputRef={scanInputRef}
          value={scanValue}
          onChange={(e) => setScanValue(e.target.value)}
          onKeyDown={handleScanKeyDown}
          placeholder='Scan QR → "Name-Plan"'
          variant="outlined"
          size="small"
          sx={{
            mt: 2,
            mb: 2,
            width: 0,
            height: 0,
            padding: 0,
            overflow: "hidden",
            border: 0,
          }}
        />
      )}
      <Box sx={{ height: 400, mt: 2 }}>
        <DataGrid
          rows={displayRows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection={packing}
          disableSelectionOnClick
          selectionModel={selectionModel}
          onSelectionModelChange={(sel) => setSelectionModel(sel)}
        />
      </Box>

      {/* Label Preview */}
      {!packing && previewCustomer && (
        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Label Preview
          </Typography>

          <FormControl fullWidth sx={{ mb: 2, maxWidth: 300 }}>
            <InputLabel id="preview-customer-label">Customer</InputLabel>
            <Select
              labelId="preview-customer-label"
              label="Customer"
              value={previewCustomer.id}
              onChange={(e) => {
                const c = combinedRows.find((r) => r.id === e.target.value);
                handleCustomerChange(c);
              }}
            >
              {combinedRows.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.customer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Paper
            elevation={3}
            sx={{
              width: "4in",
              height: "2in",
              position: "relative",
              margin: "auto",
              overflow: "hidden",
            }}
          >
            <div style={{ width: "4in", height: "2in" }}>
              <div ref={previewCustomerRef} />
            </div>
          </Paper>
        </Paper>
      )}
    </Box>
  );
}
