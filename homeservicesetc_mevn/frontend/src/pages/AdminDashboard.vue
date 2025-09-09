<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 p-6">
      <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <!-- Pending Providers -->
      <div class="mb-10">
        <h2 class="text-lg font-semibold mb-3">Pending Providers</h2>
        <table class="w-full border">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-2 border">Name</th>
              <th class="p-2 border">Email</th>
              <th class="p-2 border">Insurance</th>
              <th class="p-2 border">ID</th>
              <th class="p-2 border">Expiry</th>
              <th class="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in pendingProviders" :key="p._id">
              <td class="p-2 border">{{ p.user.name }}</td>
              <td class="p-2 border">{{ p.user.email }}</td>
              <td class="p-2 border">
                <a :href="p.insuranceDoc" target="_blank" class="text-blue-600">View</a>
              </td>
              <td class="p-2 border">
                <a :href="p.idDoc" target="_blank" class="text-blue-600">View</a>
              </td>
              <td class="p-2 border">{{ p.insuranceExpiry }}</td>
              <td class="p-2 border">
                <button
                  @click="verifyProvider(p._id, true)"
                  class="bg-green-600 text-white px-2 py-1 rounded mr-2"
                >
                  Approve
                </button>
                <button
                  @click="verifyProvider(p._id, false)"
                  class="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Manage Jobs -->
      <div>
        <h2 class="text-lg font-semibold mb-3">All Jobs</h2>
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
                <button
                  @click="removeJob(j._id)"
                  class="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
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

const pendingProviders = ref([]);
const jobs = ref([]);
const token = localStorage.getItem("token");

const fetchProviders = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/admin/providers/pending", {
      headers: { Authorization: `Bearer ${token}` }
    });
    pendingProviders.value = data;
  } catch (err) {
    alert("❌ Error fetching providers: " + err.message);
  }
};

const verifyProvider = async (id, approve) => {
  try {
    await axios.post(
      `http://localhost:5000/api/admin/providers/${id}/verify`,
      { approve },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("✅ Provider updated");
    fetchProviders();
  } catch (err) {
    alert("❌ " + err.message);
  }
};

const fetchJobs = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/admin/jobs", {
      headers: { Authorization: `Bearer ${token}` }
    });
    jobs.value = data;
  } catch (err) {
    alert("❌ Error fetching jobs: " + err.message);
  }
};

const removeJob = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/admin/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("🗑 Job removed");
    fetchJobs();
  } catch (err) {
    alert("❌ " + err.message);
  }
};

onMounted(() => {
  fetchProviders();
  fetchJobs();
});
</script>
