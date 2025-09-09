const Provider = require("../models/Provider");
const Job = require("../models/Job");

// Pending Providers
exports.pendingProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ verified: "pending" }).populate("user");
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching providers", error: err.message });
  }
};

// Verify Provider
exports.verifyProvider = async (req, res) => {
  try {
    const { approve } = req.body;
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    provider.verified = approve ? "approved" : "rejected";
    await provider.save();
    res.json({ message: `Provider ${provider.verified}` });
  } catch (err) {
    res.status(500).json({ message: "Error verifying provider", error: err.message });
  }
};

// Manage Jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
};

exports.removeJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job removed" });
  } catch (err) {
    res.status(500).json({ message: "Error removing job", error: err.message });
  }
};
