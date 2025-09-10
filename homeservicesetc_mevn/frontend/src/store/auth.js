// frontend/src/store/auth.js
import { defineStore } from "pinia";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    user: null
  }),
  actions: {
    async login(email, password) {
      const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
      this.token = data.token;
      this.role = data.role;
      this.user = data.user;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
    },
    async register(payload) {
      const { data } = await axios.post(`${API_BASE}/auth/register`, payload);
      this.token = data.token;
      this.role = data.role;
      this.user = data.user;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
    },
    logout() {
      this.token = null;
      this.role = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }
});
