import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// 🔹 API URL test log 
console.log("API URL:", import.meta.env.VITE_API_URL);

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
