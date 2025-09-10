// frontend/src/api.js
import axios from "axios";

// ✅ baseURL env se lega, fallback current origin
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || window.location.origin + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
