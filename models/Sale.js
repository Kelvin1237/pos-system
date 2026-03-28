const sequelize = require("../db/connect");
const { DataTypes } = require("sequelize");

const Sale = sequelize.define("Sale", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  paymentMethod: {
    type: DataTypes.ENUM("CASH"),
    defaultValue: "CASH",
  },

  cashGiven: {
    type: DataTypes.FLOAT,
  },

  change: {
    type: DataTypes.FLOAT,
  },

  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Sale;
