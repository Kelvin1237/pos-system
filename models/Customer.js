const sequelize = require("../db/connect");
const { DataTypes } = require("sequelize");

const Customer = sequelize.define("Customer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  fullName: {
    type: DataTypes.STRING,
  },

  phone: {
    type: DataTypes.STRING,
    unique: true,
  },

  email: {
    type: DataTypes.STRING,
    unique: true,
  },

  loyaltyPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Customer;
