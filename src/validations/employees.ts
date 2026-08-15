import { body, query } from "express-validator";
import { positiveIntValidation } from "../utils/validation";

export const employeeIdValidation = [
  positiveIntValidation("id", "param"),
];

export const createEmployeeValidation = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .escape(),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .trim()
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .isMobilePhone("any")
    .withMessage("Invalid phone number format"),

  body("cityId")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("City ID must be a positive integer"),

  positiveIntValidation("roleId", "body"),

  body("permissionIds")
    .optional()
    .isArray()
    .withMessage("Permission IDs must be an array"),

  body("permissionIds.*")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Each permission ID must be a positive integer"),
];

export const updateEmployeeValidation = [
  positiveIntValidation("id", "param"),

  body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty")
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .escape(),

  body("email")
    .optional({ values: "falsy" })
    .isEmail()
    .withMessage("Invalid email format")
    .trim()
    .normalizeEmail(),

  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .isMobilePhone("any")
    .withMessage("Invalid phone number format"),

  body("cityId")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("City ID must be a positive integer"),

  body("roleId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Role ID must be a positive integer"),

  body("permissionIds")
    .optional()
    .isArray()
    .withMessage("Permission IDs must be an array"),

  body("permissionIds.*")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Each permission ID must be a positive integer"),
];

export const getEmployeesQueryValidation = [
  query("p")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("l")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("s")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search text cannot exceed 100 characters")
    .escape(),
];