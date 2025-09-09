import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    user: null
  }),
  actions: {
    async login(email, password) {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      this.token = data.token;
      this.role = data.role;
      this.user = data.user;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
    },
    async register(payload) {
      const { data } = await axios.post("http://localhost:5000/api/auth/register", payload);
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
