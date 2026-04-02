const { StatusCodes } = require("http-status-codes");
const { Customer, Sale, SalesItem, Product } = require("../models");

/* =========================
   REGISTER CUSTOMER
========================= */
const createCustomer = async (req, res) => {
  const { fullName, phone, email } = req.body;

  try {
    const existingCustomer = await Customer.findOne({
      where: { phone },
    });

    if (existingCustomer) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Customer already exists",
      });
    }

    const customer = await Customer.create({
      fullName,
      phone,
      email,
    });

    res.status(StatusCodes.CREATED).json({
      msg: "Customer registered successfully",
      customer,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

/* =========================
   GET ALL CUSTOMERS
========================= */
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(StatusCodes.OK).json({
      totalCustomers: customers.length,
      customers,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

/* =========================
   ADD LOYALTY POINTS
========================= */
const addLoyaltyPoints = async (customerId, amountSpent) => {
  const customer = await Customer.findByPk(customerId);

  if (!customer) return;

  // Example: 1 point for every ₵10 spent
  const pointsEarned = Math.floor(amountSpent / 10);

  customer.loyaltyPoints += pointsEarned;
  await customer.save();
};

module.exports = {
  createCustomer,
  getAllCustomers,
  addLoyaltyPoints,
};
