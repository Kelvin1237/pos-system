const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getAllCustomers,
} = require("../controllers/customerController");

const {
  validateRegisterCustomerInput,
} = require("../middleware/validationMiddleware");

router.post("/", validateRegisterCustomerInput, createCustomer);
router.get("/", getAllCustomers);

module.exports = router;
