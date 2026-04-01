const { StatusCodes } = require("http-status-codes");
const axios = require("axios");
const { Sale, SalesItem, Product } = require("../models/index");

/* =========================
   REUSABLE SALE PROCESSOR
========================= */
const processSaleItems = async (items, saleId) => {
  let totalAmount = 0;
  const saleItemsData = [];

  for (const item of items) {
    const product = await Product.findByPk(item.productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.quantity < item.quantity) {
      throw new Error(`Not enough stock for ${product.name}`);
    }

    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;

    // Reduce stock
    product.quantity -= item.quantity;
    await product.save();

    saleItemsData.push({
      saleId,
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  await SalesItem.bulkCreate(saleItemsData);

  return totalAmount;
};

/* =========================
   CASH SALE
========================= */

const createSale = async (req, res) => {
  const {
    items,
    cashGiven,
    paymentMethod = "CASH",
    paymentReference = null,
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Cart is empty",
    });
  }

  let totalAmount = 0;
  const saleItemsData = [];

  try {
    /* =========================
       VALIDATE STOCK + CALCULATE TOTAL
    ========================= */
    for (const item of items) {
      const product = await Product.findByPk(item.productId);

      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({
          msg: "Product not found",
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: `Not enough stock for ${product.name}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      saleItemsData.push({
        product,
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    /* =========================
       CASH PAYMENT LOGIC
    ========================= */
    let change = 0;

    if (paymentMethod === "CASH") {
      if (!cashGiven || cashGiven < totalAmount) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "Insufficient cash provided",
        });
      }

      change = cashGiven - totalAmount;
    }

    /* =========================
       CREATE SALE
    ========================= */
    const sale = await Sale.create({
      createdBy: req.user.userId,
      totalAmount,
      paymentMethod,
      cashGiven: paymentMethod === "CASH" ? cashGiven : totalAmount,
      change,
      paymentReference,
    });

    /* =========================
       SAVE ITEMS + REDUCE STOCK
    ========================= */
    const itemsToSave = [];

    for (const item of saleItemsData) {
      item.product.quantity -= item.quantity;
      await item.product.save();

      itemsToSave.push({
        saleId: sale.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    await SalesItem.bulkCreate(itemsToSave);

    res.status(StatusCodes.CREATED).json({
      msg: "Sale successful",
      sale,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

/* =========================
   PAYSTACK VERIFY SALE
========================= */
const verifyPaystackPayment = async (req, res) => {
  const { paymentReference, items, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Cart is empty",
    });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${paymentReference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const paymentData = response.data.data;

    const paidAmount = paymentData.amount / 100;

    if (paymentData.status !== "success") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Payment verification failed",
      });
    }

    const sale = await Sale.create({
      createdBy: req.user.userId,
      totalAmount: 0,
      paymentMethod,
      cashGiven: paymentData.amount / 100,
      change: 0,
      paymentReference,
    });

    const totalAmount = await processSaleItems(items, sale.id);

    if (paidAmount < totalAmount) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Paid amount is less than cart total",
      });
    }

    sale.totalAmount = totalAmount;
    await sale.save();

    res.status(StatusCodes.CREATED).json({
      msg: "Payment verified and sale completed",
      totalAmount,
      paymentReference,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Payment verification failed",
      error: error.message,
    });
  }
};

/* =========================
   GET ALL SALES
========================= */
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        {
          model: SalesItem,
          include: [Product],
        },
      ],
    });

    const totalSales = await Sale.count();

    const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);

    res.status(StatusCodes.OK).json({
      totalSales,
      totalRevenue,
      sales,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

/* =========================
   CASHIER SALES
========================= */
const getAllSalesMade = async (req, res) => {
  try {
    const cashierId = req.user.userId;

    const sales = await Sale.findAll({
      where: { createdBy: cashierId },
      include: [
        {
          model: SalesItem,
          include: [Product],
        },
      ],
    });

    const totalSales = await Sale.count({
      where: { createdBy: cashierId },
    });

    const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);

    res.status(StatusCodes.OK).json({
      totalSales,
      totalRevenue,
      sales,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

/* =========================
   GET SALE BY ID
========================= */
const getSaleById = async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await Sale.findByPk(id, {
      include: [
        {
          model: SalesItem,
          include: [Product],
        },
      ],
    });

    if (!sale) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Sale not found",
      });
    }

    res.status(StatusCodes.OK).json(sale);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

module.exports = {
  createSale,
  verifyPaystackPayment,
  getAllSales,
  getAllSalesMade,
  getSaleById,
};
