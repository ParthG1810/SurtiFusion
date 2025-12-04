import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PrintIcon from "@mui/icons-material/Print";
import classNames from "classnames";

import { getMonthlySchedule, patchOrderItem } from "../api/schedule";
import "./css/MonthlySchedule.css";

// Colour palette per meal‑plan code.
const COLOURS = {
  roti: "#FFB74D",
  dalRice: "#81C784",
  full: "#64B5F6",
  absent: "#E0E0E0",
};

export default function MonthlySchedule() {
  const [month, setMonth] = useState(dayjs().startOf("month"));
  const [matrix, setMatrix] = useState(null);
  const [loading, setLoading] = useState(false);

  // drag‑select state
  const [isDragging, setIsDragging] = useState(false);
  const [dragMark, setDragMark] = useState(null); // { isAbsent: true/false }

  const daysInMonth = month.daysInMonth();

  // Load schedule ----------------------------------------------------
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getMonthlySchedule(month.format("YYYY-MM"));
      setMatrix(res.data);
      setLoading(false);
    })();
  }, [month]);

  // Helpers ----------------------------------------------------------
  const onMouseUp = () => setIsDragging(false);
  const startDrag = (mark) => () => {
    setIsDragging(true);
    setDragMark(mark);
  };
  const toggleItem = async (id, mark) => {
    await patchOrderItem(id, mark);
    // refresh just that item client‑side (cheap); or simply reload everything:
    const res = await getMonthlySchedule(month.format("YYYY-MM"));
    setMatrix(res.data);
  };

  // Summary table (price, absent count) ------------------------------
  const summary = useMemo(() => {
    if (!matrix) return [];
    return Object.values(matrix).map((row) => {
      const days = Object.values(row.days);
      const absentCnt = days.filter((d) => d.isAbsent).length;
      const attended = days.length - absentCnt;
      const priceDay = days[0]?.mealPlan?.pricePerDay || 0;
      return {
        name: row.customer.name,
        absentCnt,
        subtotal: attended * priceDay,
      };
    });
  }, [matrix]);

  // -----------------------------------------------------------------
  return (
    <Paper sx={{ p: 2 }} onMouseUp={onMouseUp}>
      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="h5">Monthly Tiffin Schedule</Typography>
        <DatePicker
          views={["year", "month"]}
          value={month}
          onChange={(v) => v && setMonth(v.startOf("month"))}
        />
        <Tooltip title="Print view">
          <IconButton onClick={() => window.print()}>
            <PrintIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Colour palette */}
      <Box mt={2} display="flex" gap={1}>
        {Object.entries(COLOURS).map(([k, colour]) => (
          <Button
            key={k}
            size="small"
            sx={{
              backgroundColor: colour,
              color: "#000",
              textTransform: "none",
            }}
            onMouseDown={startDrag(
              k === "absent" ? { isAbsent: true } : { isAbsent: false }
            )}
          >
            {k.toUpperCase()}
          </Button>
        ))}
      </Box>

      {/* Grid */}
      {loading || !matrix ? (
        <Typography sx={{ mt: 4 }}>Loading…</Typography>
      ) : (
        <Box mt={2} className="schedule-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Customer / Plan</th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th key={i + 1}>{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.values(matrix).map((row) => (
                <tr key={row.customer.id}>
                  <td className="sticky-col">
                    <strong>{row.customer.name}</strong>
                  </td>
                  {Array.from({ length: daysInMonth }, (_, d) => {
                    const cell = row.days[d + 1];
                    if (!cell) return <td key={d} className="blank" />;

                    const colourKey = cell.isAbsent
                      ? "absent"
                      : cell.mealPlan.code;
                    return (
                      <td
                        key={d}
                        className={classNames("cell", colourKey)}
                        onMouseEnter={() =>
                          isDragging &&
                          dragMark &&
                          toggleItem(cell.id, dragMark)
                        }
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}

      {/* Summary */}
      {summary.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">Monthly Totals</Typography>
          <table className="totals-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Absent Days</th>
                <th>Subtotal ($)</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((s) => (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td>{s.absentCnt}</td>
                  <td>{s.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </Paper>
  );
}
