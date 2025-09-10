<template>
  <div class="max-w-md mx-auto mt-10 p-6 border rounded shadow">
    <h1 class="text-2xl font-bold mb-4">Login / Register</h1>

    <div class="mb-4">
      <label class="block text-sm font-medium">Email</label>
      <input v-model="form.email" type="email" class="w-full border rounded p-2" />
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium">Password</label>
      <input v-model="form.password" type="password" class="w-full border rounded p-2" />
    </div>

    <div v-if="isRegister" class="mb-4">
      <label class="block text-sm font-medium">Name</label>
      <input v-model="form.name" type="text" class="w-full border rounded p-2" />
    </div>

    <div v-if="isRegister" class="mb-4">
      <label class="block text-sm font-medium">Role</label>
      <select v-model="form.role" class="w-full border rounded p-2">
        <option value="poster">Poster</option>
        <option value="provider">Provider</option>
      </select>
    </div>

    <div v-if="isRegister" class="mb-4 flex items-center">
      <input v-model="form.acceptedIndemnity" type="checkbox" class="mr-2" />
      <span>
        I accept the
        <a href="/legal/indemnity.html" target="_blank" class="text-blue-600">
          indemnity agreement
        </a>
      </span>
    </div>

    <button
      @click="submit"
      class="bg-blue-600 text-white px-4 py-2 rounded w-full"
    >
      {{ isRegister ? "Register" : "Login" }}
    </button>

    <p class="mt-4 text-center text-sm">
      <span v-if="isRegister">
        Already have an account?
        <a @click="isRegister = false" class="text-blue-600 cursor-pointer">Login</a>
      </span>
      <span v-else>
        Don’t have an account?
        <a @click="isRegister = true" class="text-blue-600 cursor-pointer">Register</a>
      </span>
    </p>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "../store/auth";

const auth = useAuthStore();
const isRegister = ref(false);

const form = reactive({
  name: "",
  email: "",
  password: "",
  role: "poster",
  acceptedIndemnity: false,
});

const submit = async () => {
  try {
    if (isRegister.value) {
      await auth.register(form);
      window.location.href = "/";
    } else {
      await auth.login({
        email: form.email,
        password: form.password,
      });
      window.location.href = "/";
    }
  } catch (err) {
    console.error(err);
  }
};
</script>
