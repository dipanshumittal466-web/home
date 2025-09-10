// frontend/src/api.js
import axios from "axios";

// Base URL automatic select (local OR production)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.homeservicesetc.com/api",
  withCredentials: true,
});

export default API;
