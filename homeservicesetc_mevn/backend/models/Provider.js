const mongoose = require("mongoose");

const ProviderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String },
  insuranceDoc: { type: String }, // file path
  insuranceExpiry: { type: Date },
  idDoc: { type: String }, // file path
  verified: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Provider", ProviderSchema);
