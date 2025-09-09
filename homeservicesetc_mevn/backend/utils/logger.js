const AuditLog = require("../models/AuditLog");

exports.logAction = async (action, user, details = {}) => {
  try {
    await AuditLog.create({
      action,
      user,
      details,
      timestamp: new Date()
    });
    console.log("📝 Audit Log:", action);
  } catch (err) {
    console.error("❌ Audit Log Error:", err.message);
  }
};
