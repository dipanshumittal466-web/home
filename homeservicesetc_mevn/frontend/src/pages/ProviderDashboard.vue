<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 p-6">
      <h1 class="text-2xl font-bold mb-4">Provider Dashboard</h1>

      <!-- Upload Documents -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-2">Upload Verification Documents</h2>
        <form @submit.prevent="uploadDocs" class="space-y-3">
          <input type="file" @change="onFileChange($event, 'insuranceDoc')" class="block w-full border rounded p-2" />
          <input type="file" @change="onFileChange($event, 'idDoc')" class="block w-full border rounded p-2" />
          <input type="date" v-model="insuranceExpiry" class="block w-full border rounded p-2" />
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
        </form>
        <p v-if="provider?.verified" class="mt-2">
          Status: <span class="font-bold">{{ provider.verified }}</span>
        </p>
      </div>

      <!-- Browse Jobs -->
      <div>
        <h2 class="text-lg font-semibold mb-2">Available Jobs</h2>
        <table class="w-full border">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-2 border">Title</th>
              <th class="p-2 border">Description</th>
              <th class="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="j in jobs" :key="j._id">
              <td class="p-2 border">{{ j.title }}</td>
              <td class="p-2 border">{{ j.description }}</td>
              <td class="p-2 border">
                <button @click="applyJob(j._id)" class="bg-green-600 text-white px-2 py-1 rounded">
                  Apply
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Sidebar from "../components/Sidebar.vue";
import axios from "axios";

const provider = ref(null);
const jobs = ref([]);
const insuranceExpiry = ref("");
const files = ref({ insuranceDoc: null, idDoc: null });

const token = localStorage.getItem("token");

const onFileChange = (event, field) => {
  files.value[field] = event.target.files[0];
};

const uploadDocs = async () => {
  try {
    const formData = new FormData();
    if (files.value.insuranceDoc) formData.append("insuranceDoc", files.value.insuranceDoc);
    if (files.value.idDoc) formData.append("idDoc", files.value.idDoc);
    if (insuranceExpiry.value) formData.append("insuranceExpiry", insuranceExpiry.value);

    const { data } = await axios.post("http://localhost:5000/api/providers/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    provider.value = data;
    alert("✅ Documents uploaded");
  } catch (err) {
    alert("❌ " + err.message);
  }
};

const fetchJobs = async () => {
  const { data } = await axios.get("http://localhost:5000/api/jobs");
  jobs.value = data;
};

onMounted(fetchJobs);
</script>
