const User = require("./User");
const Product = require("./Product");
const Sale = require("./Sale");
const SalesItem = require("./SalesItem");

User.hasMany(Sale, { foreignKey: "userId" });
Sale.belongsTo(User, { foreignKey: "userId" });

Sale.hasMany(SalesItem, { foreignKey: "saleId" });
SalesItem.belongsTo(Sale, { foreignKey: "saleId" });

Product.hasMany(SalesItem, { foreignKey: "productId" });
SalesItem.belongsTo(Product, { foreignKey: "productId" });

module.exports = {
  User,
  Product,
  Sale,
  SalesItem,
};
