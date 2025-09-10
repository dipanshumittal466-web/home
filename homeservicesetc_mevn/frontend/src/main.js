const app = document.getElementById('app');

async function load(){
  const cats = await fetch(`${import.meta.env.VITE_API_URL}/categories`)
  .then(r => r.json());
  let totalSubs = cats.reduce((acc,c)=> acc + (c.children?c.children.length:0), 0);
  app.innerHTML = `<h1>HomeServicesEtc</h1>
  <p><b>11</b> main categories (icons) + <b>${totalSubs}</b> subcategories = <b>${11+totalSubs}</b> total.</p>
  <ul>` + cats.map(c=>`<li>${c.name}</li>`).join('') + `</ul>`;
}
load();
