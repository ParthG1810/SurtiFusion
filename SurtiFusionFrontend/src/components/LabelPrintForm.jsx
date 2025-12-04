// src/pages/LabelPrint.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useReactToPrint } from "react-to-print";
import { useNotification } from "../context/NotificationContext";
import api from "../services/api";
import { labelPrint } from "../services/orders";
import { list } from "../services/customers";

export default function LabelPrint() {
  const notify = useNotification();

  // --- 1) State for “single‐label” dropdowns + live preview
  const [allCombos, setAllCombos] = useState([]); // [{ id, customer, plan, address }]
  const [distinctCustomers, setDistinctCustomers] = useState([]);
  const [plansForCustomer, setPlansForCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const previewRef = useRef(null);

  // --- 2) State for “multi-select DataGrid”
  const [gridRows, setGridRows] = useState([]); // same shape as allCombos
  const [selectionModel, setSelectionModel] = useState([]);

  // --- 3) Label template HTML (with placeholders)
  const [templateHtml, setTemplateHtml] = useState("");

  // --- 4) Hidden container for react-to-print
  const printPreviewContainerRef = useRef();

  // ─── FETCH “HISTORY” + TEMPLATE ─────────────────────────────────────────────
  useEffect(() => {
    // 4a) Fetch history (assumes /orders/history returns items similar to `daily()`):
    let tempCustomers = null;
    let tempPlan = null;
    let tempaddress = null;
    let combos = null;

    list()
      .then((res) => {
        const map = new Map();
        const items = res.data.map((cust, idx) => {
          const customerName = cust.name || "";
          const customerAddress = cust.address || "";
          if (customerName) {
            const key = `${customerName}`;
            if (!map.has(key)) {
              map.set(key, {
                id: idx + 1,
                customer: customerName,
                address: customerAddress,
                copies: 1,
              });
            }
          }
          return {
            id: idx + 1,
            customer: cust.name,
            address: cust.address,
          };
        });
        combos = Array.from(map.values());
        setAllCombos(combos);
        setGridRows(combos);
      })
      .catch((err) =>
        notify({
          message: "Failed to load Customer. " + err.message,
          severity: "error",
        })
      );
    labelPrint()
      .then((res) => {
        const map = new Map();
        const items = res.data.map((item, idx) => {
          const o = item.order || {};
          const p = item.meal_plan || {};
          const c = o.customer || {};
          const customerName = c.name || "";
          const customerAddress = c.address || "";
          const planName = p.name || p.planname || "";
          if (customerName && planName) {
            const key = `${customerName}|${planName}`;
            if (!map.has(key)) {
              map.set(key, {
                id: idx + 1,
                customer: customerName,
                plan: planName,
                address: customerAddress,
                copies: 1,
              });
            }
          }
          return {
            id: idx + 1,
            plan: p?.name || p?.planname,
            customer: c.name,
            address: c.address,
          };
        });
        //combos = Array.from(map.values());
        // setAllCombos(combos);
        //setGridRows(combos);
        const customers = [...new Set(combos.map((row) => row.customer))];
        setDistinctCustomers(customers);
        // Pre-select the first customer + plan
        if (customers.length > 0) {
          setSelectedCustomer(customers[0]);
          tempCustomers = customers[0];
          tempaddress = combos.find(
            (x) => x.customer === tempCustomers
          )?.address;
          // Filter their plans
          const plans = combos
            .filter((r) => r.customer === customers[0])
            .map((r) => r.plan);
          setPlansForCustomer([...new Set(plans)]);
          if (plans.length > 0) {
            setSelectedPlan(plans[0]);
            tempPlan = plans[0];
          }
        }
      })
      .catch((err) =>
        notify({
          message: "Failed to load history. " + err.message,
          severity: "error",
        })
      );

    // 4b) Fetch label template
    api
      .get("/label-template")
      .then(({ data }) => {
        setTemplateHtml(data.content || "");
        if (previewRef.current) {
          previewRef.current.innerHTML = buildPreviewHtml(
            data.content,
            tempCustomers,
            tempPlan,
            tempaddress
          );
        }
      })
      .catch((err) => {
        console.error(err);
        notify({ message: "Failed to load label template", severity: "error" });
      });
  }, [notify]);
  function buildPreviewHtml(html, selectedCustomer, selectedPlan, address) {
    // 1) Substitute “SAMPLE_NAME”, “SAMPLE_ADDRESS”, and “SAMPLE_PLAN”
    let customerAddress = address;
    let filled = null;
    if (address === null) {
      customerAddress = allCombos.find((x) => x.customer === selectedCustomer);
      filled = html
        .replace(/{{customerName}}/g, selectedCustomer)
        .replace(/{{customerAddress}}/g, customerAddress?.address)
        .replace(/{{mealPlan}}/g, selectedPlan);
    } else {
      filled = html
        .replace(/{{customerName}}/g, selectedCustomer)
        .replace(/{{customerAddress}}/g, address)
        .replace(/{{mealPlan}}/g, selectedPlan);
    }

    // 2) Compute the QR payload & URL (5mm × 5mm)
    const qrPayload = `${selectedCustomer}-${selectedPlan}`;
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
  // ─── UPDATE “plansForCustomer” WHEN “selectedCustomer” CHANGES ───────────────
  useEffect(() => {
    if (!selectedCustomer) return;
    const plans = allCombos
      .filter((r) => r.customer === selectedCustomer)
      .map((r) => r.plan);
    setPlansForCustomer([...new Set(plans)]);
    if (plans.length > 0) {
      setSelectedPlan(plans[0]);
    }
  }, [selectedCustomer, allCombos]);
  const handleCustomerChange = (e) => {
    setSelectedCustomer(e);
    if (previewRef.current) {
      previewRef.current.innerHTML = buildPreviewHtml(
        templateHtml,
        e,
        selectedPlan,
        null
      );
    }
  };
  const handlePlanChange = (e) => {
    setSelectedPlan(e);
    if (previewRef.current) {
      previewRef.current.innerHTML = buildPreviewHtml(
        templateHtml,
        selectedCustomer,
        e,
        null
      );
    }
  };

  // ─── REACT-TO-PRINT FOR “With Preview” ──────────────────────────────────────
  const reactToPrintPreviewHandler = useReactToPrint({
    content: () => printPreviewContainerRef.current,
    contentRef: printPreviewContainerRef,
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
  // ─── HANDLER: “Print Single (with Preview)” ─────────────────────────────────
  const handlePrintSingleWithPreview = () => {
    const row = allCombos.find(
      (r) => r.customer === selectedCustomer && r.plan === selectedPlan
    );
    if (!row) {
      notify({ message: "No matching record", severity: "error" });
      return;
    }
    if (printPreviewContainerRef.current) {
      printPreviewContainerRef.current.innerHTML = buildPreviewHtml(
        templateHtml,
        row.customer,
        row.plan,
        row.address
      );
      reactToPrintPreviewHandler();
    }
  };
  /* 
  // ─── “Print Selected” HELPERS ────────────────────────────────────────────────
  function buildMultipleHtml(rowsToPrint) {
    return rowsToPrint
      .map((row) =>
        buildPreviewHtml(templateHtml, row.customer, row.plan, null)
      )
      .join("\n");
  } */

  // ─── HANDLER: “Print Selected (with Preview)” ───────────────────────────────
  const handlePrintSelectedWithPreview = () => {
    if (selectionModel.length === 0) {
      notify({ message: "Select at least one row", severity: "warning" });
      return;
    }
    const html = selectionModel
      .flatMap((id) => {
        const row = gridRows.find((r) => r.id === id);
        if (!row) return [];
        // row.copies might be undefined or <= 0; default to 1
        const count = Number(row.copies) > 0 ? Number(row.copies) : 1;
        return Array(count).fill(
          buildPreviewHtml(
            row.templateHtml || templateHtml,
            row.customer,
            row.plan,
            row.address
          )
        );
      })
      .join("\n");
    // const rowsToPrint = gridRows.filter((r) => selectionModel.includes(r.id));
    //  const html = buildMultipleHtml(rowsToPrint);
    if (printPreviewContainerRef.current) {
      printPreviewContainerRef.current.innerHTML = html;
      reactToPrintPreviewHandler();
    }
  };

  // ─── DATAGRID + MAIN RENDER ──────────────────────────────────────────────────
  const columns = [
    { field: "customer", headerName: "Customer", width: 200 },
    { field: "address", headerName: "Address", width: 250 },
    {
      field: "copies",
      headerName: "Copies",
      width: 100,
      editable: true,
      type: "number",
    },
  ];
  const handleCellEditCommit = (params) => {
    const { id, field, value } = params;
    if (field === "copies") {
      setGridRows((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, copies: Number(value) || 1 } : r
        )
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Label Print
      </Typography>

      {/* ── Single‐Label Dropdowns + Preview + Buttons ────────────────────── */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Print One Label
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="customer-select-label">Customer</InputLabel>
            <Select
              labelId="customer-select-label"
              value={selectedCustomer}
              label="Customer"
              onChange={(e) => {
                handleCustomerChange(e.target.value);
              }}
            >
              {distinctCustomers.map((cust) => (
                <MenuItem key={cust} value={cust}>
                  {cust}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="plan-select-label">Meal Plan</InputLabel>
            <Select
              labelId="plan-select-label"
              value={selectedPlan}
              label="Meal Plan"
              onChange={(e) => {
                handlePlanChange(e.target.value);
              }}
            >
              {plansForCustomer.map((pln) => (
                <MenuItem key={pln} value={pln}>
                  {pln}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handlePrintSingleWithPreview}
            sx={{ ml: 2 }}
          >
            Print with Preview
          </Button>
        </Stack>

        <Typography variant="subtitle1" gutterBottom>
          Live Preview
        </Typography>
        <Paper
          sx={{
            width: "4in",
            height: "2in",
            position: "relative",
            margin: "auto",
            overflow: "hidden",
          }}
        >
          <div style={{ width: "4in", height: "2in" }}>
            <div ref={previewRef} />
          </div>
          {/* We inject filled HTML into previewRef in useEffect below */}
        </Paper>
      </Paper>

      {/* ── Multi-Select DataGrid + Buttons ──────────────────────────────── */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Print Multiple Labels (Select Rows)
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            disabled={selectionModel.length === 0}
            onClick={handlePrintSelectedWithPreview}
          >
            Print Selected (Preview)
          </Button>
        </Stack>

        <Box sx={{ height: 1000, width: 900 }}>
          <DataGrid
            rows={gridRows}
            columns={columns}
            checkboxSelection
            pageSize={25}
            rowsPerPageOptions={[50]}
            disableSelectionOnClick
            selectionModel={selectionModel}
            onSelectionModelChange={(newSelection) =>
              setSelectionModel(newSelection)
            }
            onCellEditCommit={handleCellEditCommit}
          />
        </Box>
      </Paper>

      {/* Hidden container for react-to-print */}
      <div style={{ display: "none" }}>
        <div ref={printPreviewContainerRef} />
      </div>
    </Box>
  );
}
