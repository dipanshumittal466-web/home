// backend/server.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { connectDB } from './config/db.js';
import { Models, initModels } from './models/index.js';
import { authMiddleware, requireRole } from './middleware/auth.js';
import authRoutes from './routes/auth.js';

dotenv.config({ path: fs.existsSync('.env.production') ? '.env.production' : '.env' });

try {
  await connectDB();
  await initModels();
  console.log("✅ Database connected and models initialized");
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
  process.exit(1);
}

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN?.split(',') || '*' }));

// Stripe webhook BEFORE json parser
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
    return res.json({ received: true });
  } catch (err) {
    console.error("❌ Stripe webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

app.use('/uploads', express.static(path.join(process.cwd(), 'backend', 'uploads')));
app.use(express.json({ limit: '2mb' }));

// Health Check (kept only one but both handled)
app.get('/api/health', (req, res) => res.json({ status: "ok", message: "Backend running successfully" }));

authRoutes(app);

app.get('/api/categories', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join('scripts', 'categories_final.json'), 'utf-8'));
  res.json(data);
});

// Jobs
app.post('/api/jobs', async (req, res) => {
  try {
    const job = await Models.Job.create({ ...req.body, status: 'open' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/jobs', async (req, res) => {
  try {
    const type = process.env.DB_TYPE || 'mongo';
    const { category } = req.query;
    if (type === 'sql') {
      const where = category ? { where: { category } } : {};
      const list = await Models.Job.findAll(where);
      res.json(list);
    } else {
      const where = category ? { category } : {};
      const list = await Models.Job.find(where);
      res.json(list);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Providers
app.post('/api/providers/register', async (req, res) => {
  const p = await Models.Provider.create({ ...req.body, verified: false });
  res.json(p);
});
app.post('/api/providers/verify', async (req, res) => {
  const { id } = req.body;
  const type = process.env.DB_TYPE || 'mongo';
  if (type === 'sql') {
    const p = await Models.Provider.findByPk(id);
    if (!p) return res.status(404).json({ error: 'provider not found' });
    await p.update({ verified: true });
    res.json(p);
  } else {
    const p = await Models.Provider.findById(id);
    if (!p) return res.status(404).json({ error: 'provider not found' });
    p.verified = true;
    await p.save();
    res.json(p);
  }
});

app.post('/api/indemnity/accept', async (req, res) => {
  const { providerId } = req.body;
  const type = process.env.DB_TYPE || 'mongo';
  if (type === 'sql') {
    const p = await Models.Provider.findByPk(providerId);
    if (!p) return res.status(404).json({ error: 'provider not found' });
    await p.update({ indemnityAcceptedAt: new Date().toISOString() });
    res.json({ ok: true });
  } else {
    const p = await Models.Provider.findById(providerId);
    if (!p) return res.status(404).json({ error: 'provider not found' });
    p.indemnityAcceptedAt = new Date().toISOString();
    await p.save();
    res.json({ ok: true });
  }
});

// Plans & Applications with quota
const PLAN_QUOTA = { basic: 10, pro: 20, plus: 35, unlimited: Infinity };
const monthKey = () => {
  const d = new Date(); return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`;
};
async function getProviderById(id) {
  const type = process.env.DB_TYPE || 'mongo';
  return type === 'sql' ? Models.Provider.findByPk(id) : Models.Provider.findById(id);
}
app.post('/api/providers/plan', authMiddleware, requireRole(['admin']), async (req, res) => {
  const { id, plan } = req.body;
  if (!(plan in PLAN_QUOTA)) return res.status(400).json({ error: 'invalid plan' });
  const p = await getProviderById(id);
  if (!p) return res.status(404).json({ error: 'provider not found' });
  if (process.env.DB_TYPE === 'sql') {
    await p.update({ plan, appsCycleKey: monthKey(), appsCount: 0 });
  } else {
    p.plan = plan; p.appsCycleKey = monthKey(); p.appsCount = 0; await p.save();
  }
  res.json({ ok: true });
});

app.post('/api/applications', async (req, res) => {
  const { providerId, jobId } = req.body;
  const p = await getProviderById(providerId);
  if (!p) return res.status(404).json({ error: 'provider not found' });
  const type = process.env.DB_TYPE || 'mongo';
  const job = type === 'sql' ? await Models.Job.findByPk(jobId) : await Models.Job.findById(jobId);
  if (!job) return res.status(404).json({ error: 'job not found' });

  if (!p.verified) return res.status(403).json({ error: 'provider not verified' });
  if (!p.indemnityAcceptedAt) return res.status(403).json({ error: 'indemnity not accepted' });

  const mk = monthKey();
  const currentKey = p.appsCycleKey || '';
  const currentCount = p.appsCount || 0;
  const plan = p.plan || 'basic';
  const cap = PLAN_QUOTA[plan] ?? 10;
  let newCount = currentCount;
  if (currentKey !== mk) { newCount = 0; }

  if (newCount >= cap && cap !== Infinity) {
    return res.status(403).json({ error: 'application quota reached', plan, used: newCount, cap });
  }

  const appData = { providerId: Number(providerId), jobId: Number(jobId), status: 'submitted' };
  const application = await Models.Application.create(appData);

  if (type === 'sql') {
    await p.update({ appsCycleKey: mk, appsCount: newCount + 1 });
  } else {
    p.appsCycleKey = mk; p.appsCount = newCount + 1; await p.save();
  }
  res.json(application);
});

app.get('/api/applications', async (req, res) => {
  const { providerId, jobId } = req.query;
  const type = process.env.DB_TYPE || 'mongo';
  if (type === 'sql') {
    const where = {};
    if (providerId) where.providerId = Number(providerId);
    if (jobId) where.jobId = Number(jobId);
    const list = await Models.Application.findAll({ where });
    res.json(list);
  } else {
    const where = {};
    if (providerId) where.providerId = Number(providerId);
    if (jobId) where.jobId = Number(jobId);
    const list = await Models.Application.find(where);
    res.json(list);
  }
});

// Stripe subscribe
app.post('/api/subscribe', async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    const { email, plan = 'basic' } = req.body;
    const priceMap = {
      basic: process.env.STRIPE_PRICE_BASIC,
      pro: process.env.STRIPE_PRICE_PRO,
      plus: process.env.STRIPE_PRICE_PLUS,
      unlimited: process.env.STRIPE_PRICE_UNLIMITED
    };
    const price = priceMap[plan] || priceMap.basic;
    if (!price) return res.json({ ok: false, setupRequired: true, message: 'Stripe Prices not configured' });
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      success_url: `${process.env.ALLOWED_ORIGIN}/dashboard?subscribe=success`,
      cancel_url: `${process.env.ALLOWED_ORIGIN}/pricing?subscribe=cancel`,
      customer_email: email,
      line_items: [{ price, quantity: 1 }]
    });
    res.json({ ok: true, url: session.url });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`✅ API listening on :${port}`));

app.get("/", (req, res) => {
  res.send("✅ Backend is running. Use /api endpoints.");
});
