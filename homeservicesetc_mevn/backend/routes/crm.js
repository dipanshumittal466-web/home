// crm.js
const express = require("express");
const router = express.Router();
const { analytics } = require("../controllers/crmController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/analytics", protect, adminOnly, analytics);
module.exports = router;
