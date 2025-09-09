const mongoose = require("mongoose");
const Category = require("../models/Category");
const categoriesData = require("./categories_final.json");
const config = require("../config/config");

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected for Seeding"))
  .catch(err => console.error("❌ DB Error:", err));

const seed = async () => {
  try {
    await Category.deleteMany({});
    console.log("🗑 Old categories cleared");

    for (const mainCat of categoriesData.mainCategories) {
      const mainCategory = await Category.create({
        name: mainCat.name,
        icon: `/assets/icons/${mainCat.icon}`,
        parent: null
      });

      for (const sub of mainCat.subcategories) {
        await Category.create({
          name: sub,
          parent: mainCategory._id
        });
      }
    }

    console.log("🎉 Categories Seeded Successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error Seeding Categories:", err);
    process.exit(1);
  }
};

seed();
