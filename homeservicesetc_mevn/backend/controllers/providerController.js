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
