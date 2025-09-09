const Provider = require("../models/Provider");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage }).fields([
  { name: "insuranceDoc", maxCount: 1 },
  { name: "idDoc", maxCount: 1 }
]);

exports.uploadDocs = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ message: "Upload error", error: err.message });

    try {
      let provider = await Provider.findOne({ user: req.user.id });
      if (!provider) provider = new Provider({ user: req.user.id });

      if (req.files.insuranceDoc) provider.insuranceDoc = "/uploads/" + req.files.insuranceDoc[0].filename;
      if (req.files.idDoc) provider.idDoc = "/uploads/" + req.files.idDoc[0].filename;
      if (req.body.insuranceExpiry) provider.insuranceExpiry = req.body.insuranceExpiry;

      provider.verified = "pending";
      await provider.save();
      res.json(provider);
    } catch (e) {
      res.status(500).json({ message: "Error saving provider docs", error: e.message });
    }
  });
};
const Job = require("../models/Job");
const Provider = require("../models/Provider");

// Post Job
exports.postJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, poster: req.user.id });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error posting job", error: err.message });
  }
};

// My Jobs
exports.myJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ poster: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
};

// All Jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
};

// Apply Job
exports.applyJob = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider || provider.verified !== "approved") {
      return res.status(403).json({ message: "Provider not verified" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (!job.applicants.includes(provider._id)) {
      job.applicants.push(provider._id);
      await job.save();
    }

    res.json({ message: "Applied successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error applying job", error: err.message });
  }
};
