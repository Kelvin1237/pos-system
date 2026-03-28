const express = require("express");
const router = express.Router();

const {
  getCurrentUser,
  getAllUsers,
  updateUser,
  deleteUser,
  resetPassword,
} = require("../controllers/userController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authMiddleware");
const {
  validateUpdateUserInput,
  validateResetPasswordInput,
} = require("../middleware/validationMiddleware");

router
  .route("/")
  .get(authenticateUser, authorizePermissions("ADMIN"), getAllUsers);
router.route("/me").get(authenticateUser, getCurrentUser);
router
  .route("/reset-password")
  .patch(authenticateUser, validateResetPasswordInput, resetPassword);
router
  .route("/:id")
  .patch(
    authenticateUser,
    authorizePermissions("ADMIN"),
    validateUpdateUserInput,
    updateUser,
  )
  .delete(authenticateUser, authorizePermissions("ADMIN"), deleteUser);

module.exports = router;
