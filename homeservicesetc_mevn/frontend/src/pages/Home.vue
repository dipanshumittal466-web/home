<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Welcome to HomeServicesEtc</h1>
    <p class="mb-6 text-gray-600">Find and book trusted service providers in 311 categories.</p>

    <h2 class="text-xl font-semibold mb-3">Main Categories</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="cat in categories" :key="cat._id" class="border rounded-lg p-4 shadow hover:shadow-md">
        <img v-if="cat.icon" :src="cat.icon" alt="" class="w-12 h-12 mb-2" />
        <h3 class="font-bold">{{ cat.name }}</h3>
        <ul class="text-sm mt-2 list-disc ml-4">
          <li v-for="sub in cat.subcategories" :key="sub._id">{{ sub.name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const categories = ref([]);

onMounted(async () => {
  const { data } = await axios.get("http://localhost:5000/api/categories");
  categories.value = data;
});
</script>
