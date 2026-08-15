import { body, query } from "express-validator";
import { PropertyStatus, PropertyPurpose, PropertyDuration } from "../types/variables";
import { positiveIntValidation } from "../utils/validation";

export const propertyIdValidation = [
  positiveIntValidation("id", "param"),
];

export const createPropertyValidation = [
  body("title")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage("Title must be a string between 1 and 150 characters")
    .escape(),

  body("location")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Location must be a string between 1 and 255 characters")
    .escape(),

  body("cityId").isInt({ min: 1 }).withMessage("City ID must be a positive integer"),

  body("bedrooms").optional().isInt({ min: 0, max: 100 }).withMessage("Bedrooms must be between 0 and 100"),
  body("bathrooms").optional().isInt({ min: 0, max: 100 }).withMessage("Bathrooms must be between 0 and 100"),
  body("area").optional().isFloat({ min: 0, max: 1000000 }).withMessage("Area must be a valid positive number"),

  body("categoryId").isInt({ min: 1 }).withMessage("Category ID must be a positive integer"),

  body("desc")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .isLength({ max: 3000 })
    .withMessage("Description cannot exceed 3000 characters")
    .escape(),

  body("ownerId").optional().isInt({ min: 1 }).withMessage("Owner ID must be a positive integer"),

  body("map")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Map location string cannot exceed 500 characters")
    .escape(),

  body("status")
    .isIn(Object.values(PropertyStatus))
    .withMessage(`Status must be one of: ${Object.values(PropertyStatus).join(", ")}`),

  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("duration")
    .optional()
    .isIn(Object.values(PropertyDuration))
    .withMessage(`Duration must be one of: ${Object.values(PropertyDuration).join(", ")}`),

  body("purpose")
    .optional()
    .isIn(Object.values(PropertyPurpose))
    .withMessage(`Purpose must be one of: ${Object.values(PropertyPurpose).join(", ")}`),
];

export const updatePropertyValidation = [
  positiveIntValidation("id", "param"),

  body("title")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage("Title must be between 1 and 150 characters")
    .escape(),

  body("location")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Location must be between 1 and 255 characters")
    .escape(),

  body("cityId").optional().isInt({ min: 1 }).withMessage("City ID must be a positive integer"),
  body("bedrooms").optional().isInt({ min: 0, max: 100 }).withMessage("Bedrooms must be between 0 and 100"),
  body("bathrooms").optional().isInt({ min: 0, max: 100 }).withMessage("Bathrooms must be between 0 and 100"),
  body("area").optional().isFloat({ min: 0, max: 1000000 }).withMessage("Area must be a valid positive number"),
  body("categoryId").optional().isInt({ min: 1 }).withMessage("Category ID must be a positive integer"),

  body("backgroundUrl")
    .optional()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Invalid background URL format. Must start with http or https"),

  body("ownerId").optional().isInt({ min: 1 }).withMessage("Owner ID must be a positive integer"),

  body("map")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Map location string cannot exceed 500 characters")
    .escape(),

  body("status")
    .optional()
    .isIn(Object.values(PropertyStatus))
    .withMessage(`Status must be one of: ${Object.values(PropertyStatus).join(", ")}`),

  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("duration")
    .optional()
    .isIn(Object.values(PropertyDuration))
    .withMessage(`Duration must be one of: ${Object.values(PropertyDuration).join(", ")}`),

  body("purpose")
    .optional()
    .isIn(Object.values(PropertyPurpose))
    .withMessage(`Purpose must be one of: ${Object.values(PropertyPurpose).join(", ")}`),

  body("removeImage")
    .optional()
    .toBoolean()
    .isBoolean()
    .withMessage("removeImage must be a boolean"),
];

export const getPropertiesQueryValidation = [
  query("pa").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("l").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),

  query("se")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search text cannot exceed 100 characters")
    .escape(),

  query("ci").optional().isInt({ min: 1 }).withMessage("City ID must be a positive integer"),
  query("ca").optional().isInt({ min: 1 }).withMessage("Category ID must be a positive integer"),

  query("st")
    .optional()
    .isIn(Object.values(PropertyStatus))
    .withMessage("Invalid status value"),

  query("pu")
    .optional()
    .isIn(Object.values(PropertyPurpose))
    .withMessage("Invalid purpose value"),

  query("mip").optional().isFloat({ min: 0 }).withMessage("Min price must be a positive number"),

  query("map")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Max price must be a positive number")
    .custom((maxPrice, { req }) => {
      if (req.query?.mip && parseFloat(maxPrice) < parseFloat(req.query.mip as string)) {
        throw new Error("Max price must be greater than or equal to min price");
      }
      return true;
    }),
];

export const createNoteValidation = [
  positiveIntValidation("propertyId", "param"),
  body("note")
    .notEmpty()
    .withMessage("Note content is required")
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Note must be between 1 and 1000 characters")
    .escape(),
];

export const noteIdValidation = [
  positiveIntValidation("noteId", "param"),
];

export const imageIdValidation = [
  positiveIntValidation("imageId", "param"),
];

export const planIdValidation = [
  positiveIntValidation("planId", "param"),
];