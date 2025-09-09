# HomeServicesEtc — Final Package

This repository contains **Backend (Express + MongoDB)** and **Frontend (Vue 3 + Vite + Tailwind)** with **311 categories** (11 main + 300 subcategories) and **11 main icons**.

## Quick Start

### Backend
```
cd backend
cp .env.sample .env   # fill values
npm i
npm run dev           # or: npm start
```
- API runs on **:8080** by default.
- Static uploads served at **/uploads**.
- Stripe webhook endpoint: **/api/stripe/webhook**.

### Frontend
```
cd frontend
npm i
npm run dev           # http://localhost:5173 (proxy to :8080)
npm run build         # output to dist/
```
- Vue Router + Pinia configured.
- Icons available in `public/icons` and `src/assets/icons`.
- Legal pages at `public/legal`.

### Docs & Logos
- All step 1–18 docs in `docs/`.
- Logos in `logos/` (PDF + transparent PNG + samples).

