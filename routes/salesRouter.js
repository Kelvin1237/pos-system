const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authMiddleware");

const {
  createSale,
  getAllSales,
  getSaleById,
  getAllSalesMade,
  verifyPaystackPayment,
} = require("../controllers/salesController");

router
  .route("/")
  .post(authenticateUser, createSale)
  .get(authenticateUser, authorizePermissions("ADMIN"), getAllSales);
router
  .route("/my-sales")
  .get(authenticateUser, authorizePermissions("CASHIER"), getAllSalesMade);
router.route("/verify-paystack").post(authenticateUser, verifyPaystackPayment);

router.route("/:id").get(authenticateUser, getSaleById);

module.exports = router;
