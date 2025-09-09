const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  poster: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  location: { type: String },
  budget: { type: Number },
  status: { type: String, enum: ["open", "assigned", "completed", "cancelled"], default: "open" },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Provider" }],
}, { timestamps: true });

module.exports = mongoose.model("Job", JobSchema);
