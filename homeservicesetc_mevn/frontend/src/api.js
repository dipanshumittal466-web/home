// frontend/src/api.js
import axios from "axios";

// Base URL from .env file
const API = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API,
});

// Token ko har request ke header me attach karne ke liye interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
