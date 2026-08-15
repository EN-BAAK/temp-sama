import { body } from "express-validator";
import { positiveIntValidation } from "../utils/validation";

export const governorateIdValidation = [
  positiveIntValidation("id", "param"),
];

export const createGovernorateValidation = [
  body("name")
    .notEmpty()
    .withMessage("Governorate name is required")
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Governorate name must be between 2 and 100 characters")
    .escape(),
];

export const updateGovernorateValidation = [
  positiveIntValidation("id", "param"),
  body("name")
    .notEmpty()
    .withMessage("Governorate name cannot be empty")
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Governorate name must be between 2 and 100 characters")
    .escape(),
];

export const cityIdValidation = [
  positiveIntValidation("id", "param"),
];

export const createCityValidation = [
  body("name")
    .notEmpty()
    .withMessage("City name is required")
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("City name must be between 2 and 100 characters")
    .escape(),

  positiveIntValidation("id", "param"),
];

export const updateCityNameValidation = [
  positiveIntValidation("id", "param"),
  body("name")
    .notEmpty()
    .withMessage("City name cannot be empty")
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("City name must be between 2 and 100 characters")
    .escape(),
];