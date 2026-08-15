import { body, query } from "express-validator";
import { positiveIntValidation } from "../utils/validation";

export const clientIdValidation = [
  positiveIntValidation("id", "param"),
];

export const createClientValidation = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .escape(),

  body("email")
    .optional({ values: "falsy" })
    .isEmail()
    .withMessage("Invalid email format")
    .trim()
    .normalizeEmail(),

  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .isMobilePhone("any")
    .withMessage("Invalid phone number format"),

  body("cityId")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("City ID must be a positive integer"),

  body("budget")
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 1000000000 })
    .withMessage("Budget must be a positive number up to 1,000,000,000"),
];

export const updateClientValidation = [
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

  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .isMobilePhone("any")
    .withMessage("Invalid phone number format"),

  body("cityId")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("City ID must be a positive integer"),

  body("budget")
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 1000000000 })
    .withMessage("Budget must be a positive number up to 1,000,000,000"),
];

export const getClientsQueryValidation = [
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

export const getClientFavoritesValidation = [
  positiveIntValidation("clientId", "param"),
];

export const getClientUnFavoritesValidation = [
  positiveIntValidation("clientId", "param"),
];

export const addClientFavoriteValidation = [
  positiveIntValidation("clientId", "param"),
  positiveIntValidation("propertyId", "param"),
];

export const removeClientFavoriteValidation = [
  positiveIntValidation("clientId", "param"),
  positiveIntValidation("propertyId", "param"),
];