const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
  plan: { type: String, enum: ["basic", "standard", "premium", "unlimited"], required: true },
  jobLimit: { type: Number, default: 0 }, // 10, 20, 35, Infinity
  stripeSubscriptionId: { type: String },
  status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
  validUntil: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Subscription", SubscriptionSchema);
