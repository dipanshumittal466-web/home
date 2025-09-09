<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 p-6">
      <h1 class="text-2xl font-bold mb-6">CRM Analytics</h1>

      <!-- Revenue Chart -->
      <div class="mb-10 bg-white shadow rounded p-4">
        <h2 class="text-lg font-semibold mb-2">Revenue</h2>
        <BarChart :labels="analytics.revenue.labels" :values="analytics.revenue.values" />
        <p class="mt-2 font-bold">Total: ${{ analytics.revenue.total }}</p>
      </div>

      <!-- Jobs Chart -->
      <div class="mb-10 bg-white shadow rounded p-4">
        <h2 class="text-lg font-semibold mb-2">Jobs</h2>
        <PieChart :labels="analytics.jobs.labels" :values="analytics.jobs.values" />
        <p class="mt-2 font-bold">Total Jobs: {{ analytics.jobs.total }}</p>
      </div>

      <!-- Providers Stats -->
      <div class="bg-white shadow rounded p-4">
        <h2 class="text-lg font-semibold mb-2">Providers</h2>
        <ul>
          <li>Total: {{ analytics.providers.total }}</li>
          <li>Approved: {{ analytics.providers.approved }}</li>
          <li>Pending: {{ analytics.providers.pending }}</li>
          <li>Rejected: {{ analytics.providers.rejected }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Sidebar from "../components/Sidebar.vue";
import { Bar, Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale);

// Bar chart component
const BarChart = {
  props: ["labels", "values"],
  components: { Bar },
  template: `<Bar :data="chartData" :options="chartOptions" />`,
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: "Revenue",
            data: this.values,
            backgroundColor: ["#3b82f6"]
          }
        ]
      };
    },
    chartOptions() {
      return { responsive: true, plugins: { legend: { display: false } } };
    }
  }
};

// Pie chart component
const PieChart = {
  props: ["labels", "values"],
  components: { Pie },
  template: `<Pie :data="chartData" :options="chartOptions" />`,
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            data: this.values,
            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]
          }
        ]
      };
    },
    chartOptions() {
      return { responsive: true };
    }
  }
};

const analytics = ref({
  revenue: { total: 0, labels: [], values: [] },
  jobs: { total: 0, labels: [], values: [] },
  providers: { total: 0, approved: 0, pending: 0, rejected: 0 }
});

onMounted(async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get("http://localhost:5000/api/crm/analytics", {
    headers: { Authorization: `Bearer ${token}` }
  });
  analytics.value = data;
});
</script>
