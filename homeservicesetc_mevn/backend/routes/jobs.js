// jobs.js
const express = require("express");
const router = express.Router();
const { postJob, myJobs, getAllJobs, applyJob } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, postJob);
router.get("/mine", protect, myJobs);
router.get("/", getAllJobs);
router.post("/:id/apply", protect, applyJob);
module.exports = router;
