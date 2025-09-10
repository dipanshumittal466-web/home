// backend/controllers/subscribeController.js
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Fallback plans (local testing only)
const plans = {
  basic: process.env.STRIPE_PRICE_BASIC,
  standard: process.env.STRIPE_PRICE_STANDARD,
  premium: process.env.STRIPE_PRICE_PREMIUM,
  unlimited: process.env.STRIPE_PRICE_UNLIMITED,
};

export const subscribe = async (req, res) => {
  try {
    const { plan = "basic", email } = req.body;
    const priceId = plans[plan];

    if (!priceId) {
      return res.status(400).json({ message: "❌ Invalid plan or Stripe price not configured" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${process.env.ALLOWED_ORIGIN}/provider-dashboard?success=true`,
      cancel_url: `${process.env.ALLOWED_ORIGIN}/provider-dashboard?canceled=true`
    });

    res.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("❌ Stripe error:", err.message);
    res.status(500).json({ ok: false, message: "Payment error", error: err.message });
  }
};
