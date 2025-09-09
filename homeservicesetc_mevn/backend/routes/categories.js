// categories.js
const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  try {
    const mainCategories = await Category.find({ parent: null });
    const categoriesWithSubs = [];

    for (const main of mainCategories) {
      const subs = await Category.find({ parent: main._id });
      categoriesWithSubs.push({
        _id: main._id,
        name: main.name,
        icon: main.icon,
        subcategories: subs
      });
    }

    res.json(categoriesWithSubs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
});

module.exports = router;
