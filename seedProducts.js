const { Product } = require("./models/index");
const products = require("./utils/mockProducts.json");

const seedProducts = async () => {
  try {
    await Product.sync({ force: true });
    await Product.bulkCreate(products);
    console.log("Products seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
};

seedProducts();
