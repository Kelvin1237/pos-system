const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: errorMessages });
      }
      next();
    },
  ];
};

const validateRegisterInput = withValidationErrors([
  body("fullName").trim().notEmpty().withMessage("full name is required"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isLength({ min: 3, max: 20 })
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage(
      "username must be 3-20 characters long and contain only letters, numbers, and underscores",
    ),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.",
    ),
]);

const validateLoginInput = withValidationErrors([
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isLength({ min: 3, max: 20 })
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage(
      "username must be 3-20 characters long and contain only letters, numbers, and underscores",
    ),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.",
    ),
]);

const validateRegisterCustomerInput = withValidationErrors([
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("phone number is required")
    .isMobilePhone("en-GH")
    .withMessage("invalid phone number"),
  body("fullName").trim().notEmpty().withMessage("full name is required"),
]);

const validateProductInput = withValidationErrors([
  body("name").trim().notEmpty().withMessage("Product name is required"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Product category is required"),

  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ gt: 0 })
    .withMessage("Product price must be a number greater than 0"),

  body("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isInt({ min: 0 })
    .withMessage("Product quantity must be a non-negative integer"),
]);

const validateUpdateProductInput = withValidationErrors([
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product category is required"),

  body("price")
    .optional()
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ gt: 0 })
    .withMessage("Product price must be a number greater than 0"),

  body("quantity")
    .optional()
    .notEmpty()
    .withMessage("Product quantity is required")
    .isInt({ min: 0 })
    .withMessage("Product quantity must be a non-negative integer"),
]);

const validateUpdateUserInput = withValidationErrors([
  body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("full name is required"),
  body("username")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isLength({ min: 3, max: 20 })
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage(
      "username must be 3-20 characters long and contain only letters, numbers, and underscores",
    ),
  body("role")
    .optional()
    .notEmpty()
    .withMessage("User role is required")
    .isIn(["ADMIN", "CASHIER"])
    .withMessage("User role does not exist"),
]);

const validateResetPasswordInput = withValidationErrors([
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required")
    .isStrongPassword()
    .withMessage(
      "Old password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.",
    ),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isStrongPassword()
    .withMessage(
      "New password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.",
    ),
]);

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateProductInput,
  validateUpdateProductInput,
  validateUpdateUserInput,
  validateResetPasswordInput,
  validateRegisterCustomerInput,
};
