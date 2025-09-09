<template>
  <nav class="bg-white shadow-md p-4 flex justify-between items-center">
    <router-link to="/" class="text-xl font-bold text-blue-600">
      HomeServicesEtc
    </router-link>
    <div class="flex gap-4">
      <router-link to="/" class="hover:text-blue-500">Home</router-link>
      <router-link to="/about" class="hover:text-blue-500">About</router-link>
      <router-link to="/contact" class="hover:text-blue-500">Contact</router-link>
      <router-link v-if="!auth.token" to="/auth" class="bg-blue-600 text-white px-3 py-1 rounded">
        Login
      </router-link>
      <button v-else @click="logout" class="bg-red-500 text-white px-3 py-1 rounded">
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from "../store/auth";
const auth = useAuthStore();

const logout = () => {
  auth.logout();
  window.location.href = "/";
};
</script>
