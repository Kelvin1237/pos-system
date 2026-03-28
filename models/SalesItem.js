const sequelize = require("../db/connect");
const { DataTypes } = require("sequelize");

const SalesItem = sequelize.define("SalesItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = SalesItem;
