const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String, // e.g. "/assets/icons/main1.svg"
    default: null
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model("Category", CategorySchema);
