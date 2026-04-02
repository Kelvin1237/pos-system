const User = require("./User");
const Product = require("./Product");
const Sale = require("./Sale");
const SalesItem = require("./SalesItem");
const Customer = require("./Customer");

User.hasMany(Sale, { foreignKey: "userId" });
Sale.belongsTo(User, { foreignKey: "userId" });

Sale.hasMany(SalesItem, { foreignKey: "saleId" });
SalesItem.belongsTo(Sale, { foreignKey: "saleId" });

Customer.hasMany(Sale, {
  foreignKey: "customerId",
});

Sale.belongsTo(Customer, {
  foreignKey: "customerId",
});

Product.hasMany(SalesItem, { foreignKey: "productId" });
SalesItem.belongsTo(Product, { foreignKey: "productId" });

module.exports = {
  User,
  Product,
  Sale,
  SalesItem,
  Customer,
};
