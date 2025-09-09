const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true }, // e.g., "UPLOAD_DOC", "VERIFY_APPROVED"
  details: { type: Object },
  ipAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", AuditLogSchema);
