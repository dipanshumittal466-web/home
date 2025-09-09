// providers.js
const express = require("express");
const router = express.Router();
const { uploadDocs } = require("../controllers/providerController");
const { protect } = require("../middleware/authMiddleware");

router.post("/upload", protect, uploadDocs);
module.exports = router;
