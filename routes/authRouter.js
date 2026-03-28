const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../middleware/validationMiddleware");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authMiddleware");
const rateLimiter = require("express-rate-limit");

const apiLimiter = rateLimiter({
  windowMs: 1000 * 60 * 15,
  max: 15,
  message: {
    msg: "IP rate limit exceeded, retry in 15 minutes",
  },
});

router
  .route("/register")
  .post(
    [authenticateUser, authorizePermissions("ADMIN")],
    apiLimiter,
    validateRegisterInput,
    register,
  );
router.route("/login").post(apiLimiter, validateLoginInput, login);
router.route("/logout").get(logout);

module.exports = router;
