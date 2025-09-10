<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 p-6">
      <h1 class="text-2xl font-bold mb-4">Poster Dashboard</h1>

      <!-- Post New Job -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-2">Post a Job</h2>
        <input v-model="job.title" type="text" placeholder="Job Title" class="w-full border rounded p-2 mb-2" />
        <textarea v-model="job.description" placeholder="Job Description" class="w-full border rounded p-2 mb-2"></textarea>
        <button @click="postJob" class="bg-blue-600 text-white px-4 py-2 rounded">Post Job</button>
      </div>

      <!-- My Jobs -->
      <div>
        <h2 class="text-lg font-semibold mb-2">My Jobs</h2>
        <table class="w-full border">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-2 border">Title</th>
              <th class="p-2 border">Description</th>
              <th class="p-2 border">Applicants</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="j in jobs" :key="j._id">
              <td class="p-2 border">{{ j.title }}</td>
              <td class="p-2 border">{{ j.description }}</td>
              <td class="p-2 border">{{ j.applicants.length }}</td>
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
import axios from "../utils/axios";   // ✅ custom axios instance

const job = ref({ title: "", description: "" });
const jobs = ref([]);

const postJob = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.post("/jobs", job.value, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("✅ Job posted!");
    fetchJobs();
    job.value = { title: "", description: "" };
  } catch (err) {
    alert("❌ " + err.message);
  }
};

const fetchJobs = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get("/jobs/mine", {
      headers: { Authorization: `Bearer ${token}` }
    });
    jobs.value = data;
  } catch (err) {
    alert("❌ Error fetching jobs: " + err.message);
  }
};

onMounted(fetchJobs);
</script>
