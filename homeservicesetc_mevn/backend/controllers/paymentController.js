const Stripe = require("stripe");
const config = require("../config/config");
const stripe = new Stripe(config.stripe.secret);

const plans = {
  basic: { price: 10, jobs: 10 },
  standard: { price: 20, jobs: 20 },
  premium: { price: 30, jobs: 35 },
  unlimited: { price: 50, jobs: null }
};

exports.subscribe = async (req, res) => {
  try {
    const { plan } = req.body;
    const selectedPlan = plans[plan];
    if (!selectedPlan) return res.status(400).json({ message: "Invalid plan" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Subscription: ${plan}` },
            unit_amount: selectedPlan.price * 100
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: "http://localhost:3000/provider-dashboard?success=true",
      cancel_url: "http://localhost:3000/provider-dashboard?canceled=true"
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: "Payment error", error: err.message });
  }
};
