import axios from "axios";

// ✅ Base URL automatic select (local OR render)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://home-dchr.onrender.com/api",
  withCredentials: true
});

export default API;
