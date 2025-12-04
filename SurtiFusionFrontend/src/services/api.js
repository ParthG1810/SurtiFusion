import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Response interceptor for global error notifications
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Cannot use hook here; instead, clients catch and notify
    return Promise.reject(err);
  }
);

export default api;
