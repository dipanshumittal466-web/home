const app = document.getElementById('app');

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

    app.innerHTML = `<h1>HomeServicesEtc</h1>
      <p><b>11</b> main categories (icons) + <b>${totalSubs}</b> subcategories = <b>${11 + totalSubs}</b> total.</p>
      <ul>` + cats.map(c => `<li>${c.name}</li>`).join('') + `</ul>`;
  } catch (err) {
    app.innerHTML = `<p style="color:red">❌ Error loading categories: ${err.message}</p>`;
  }
}

load();
