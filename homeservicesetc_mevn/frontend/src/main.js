import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = document.getElementById('app');

// ✅ Vue app mount करो (yeh hona hi chahiye frontend me)
const vueApp = createApp(App);
vueApp.use(router);
vueApp.mount("#app");

// 🔹 Aapka existing async function bhi rakha hai (bina delete kiye)
async function load() {
  try {
    // ✅ Render ke liye: VITE_API_URL ko env me set karo (example: https://yourapp.onrender.com)
    const baseURL = import.meta.env.VITE_API_URL || window.location.origin;
    // local: http://localhost:5000
    // render: https://yourapp.onrender.com

    // 🔹 /api double na aaye isliye careful
    const cats = await fetch(`${baseURL}/api/categories`).then(r => r.json());

    // 🔹 DB me field children hoti hai, subcategories nahi
    let totalSubs = cats.reduce(
      (acc, c) => acc + (c.children ? c.children.length : 0),
      0
    );

    // ⚠️ Vue mount ke baad ye overwrite karega, isliye optional hi use karna
    if (app) {
      app.innerHTML = `<h1>HomeServicesEtc</h1>
        <p><b>11</b> main categories (icons) + <b>${totalSubs}</b> subcategories = <b>${11 + totalSubs}</b> total.</p>
        <ul>` + cats.map(c => `<li>${c.name}</li>`).join('') + `</ul>`;
    }
  } catch (err) {
    if (app) {
      app.innerHTML = `<p style="color:red">❌ Error loading categories: ${err.message}</p>`;
    }
  }
}

load();
