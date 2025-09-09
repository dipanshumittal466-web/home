// admin.js
const express = require("express");
const router = express.Router();
const { pendingProviders, verifyProvider, getJobs, removeJob } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/providers/pending", protect, adminOnly, pendingProviders);
router.post("/providers/:id/verify", protect, adminOnly, verifyProvider);
router.get("/jobs", protect, adminOnly, getJobs);
router.delete("/jobs/:id", protect, adminOnly, removeJob);
module.exports = router;
