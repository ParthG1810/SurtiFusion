import api from "./axios"; // ← the existing Axios instance

export const getMonthlySchedule = (month) =>
  api.get("/schedule", { params: { month } });

export const patchOrderItem = (id, payload) =>
  api.patch(`/schedule/${id}`, payload);
