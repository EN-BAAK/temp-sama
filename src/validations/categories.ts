import { body } from "express-validator";
import { positiveIntValidation } from "../utils/validation";

export const categoryIdValidation = [
  positiveIntValidation("id", "param"),
];

export const createCategoryValidation = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2 and 100 characters")
    .escape(),

  body("icon")
    .notEmpty()
    .withMessage("Icon is required")
    .isString()
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage("Icon must be between 1 and 15 characters")
    .escape(),
];

export const updateCategoryValidation = [
  positiveIntValidation("id", "param"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty")
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2 and 100 characters")
    .escape(),

  body("icon")
    .optional()
    .trim()
    .isString()
    .isLength({ min: 1, max: 15 })
    .withMessage("Icon must be between 1 and 15 characters")
    .escape(),
];