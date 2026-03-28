const express = require("express");
const {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  authorizePermissions,
  authenticateUser,
} = require("../middleware/authMiddleware");
const {
  validateProductInput,
  validateUpdateProductInput,
} = require("../middleware/validationMiddleware");
const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    authenticateUser,
    authorizePermissions("ADMIN"),
    validateProductInput,
    createProduct,
  );
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(
    authenticateUser,
    authorizePermissions("ADMIN"),
    validateUpdateProductInput,
    updateProduct,
  )
  .delete(authenticateUser, authorizePermissions("ADMIN"), deleteProduct);

module.exports = router;
