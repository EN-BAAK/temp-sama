// import { body } from "express-validator";
// import { positiveIntValidation } from "../utils/validation";

// export const roleIdValidation = [
//   positiveIntValidation("id", "param"),
// ];

// export const createRoleValidation = [
//   body("name")
//     .notEmpty().withMessage("Role name is required")
//     .isString().withMessage("Role name must be a string")
//     .isLength({ max: 100 }).withMessage("Role name cannot exceed 100 characters")
//     .escape(),
//   body("description")
//     .optional()
//     .isString().withMessage("Description must be a string")
//     .isLength({ max: 255 }).withMessage("Description cannot exceed 255 characters")
//     .escape(),
//   body("permissionsIds")
//     .optional()
//     .isArray().withMessage("permissionsIds must be an array of integers")
//     .custom((ids: any[]) => ids.every((id) => Number.isInteger(id)))
//     .withMessage("Every item in permissionsIds must be an integer"),
// ];

// export const updateRoleValidation = [
//   positiveIntValidation("id", "param"),
//   body("name")
//     .optional()
//     .notEmpty().withMessage("Role name cannot be empty")
//     .isString().withMessage("Role name must be a string")
//     .isLength({ max: 100 }).withMessage("Role name cannot exceed 100 characters")
//     .escape(),
//   body("description")
//     .optional()
//     .isString().withMessage("Description must be a string")
//     .isLength({ max: 255 }).withMessage("Description cannot exceed 255 characters")
//     .escape(),
//   body("permissionsIds")
//     .optional()
//     .isArray().withMessage("permissionsIds must be an array of integers")
//     .custom((ids: any[]) => ids.every((id) => Number.isInteger(id)))
//     .withMessage("Every item in permissionsIds must be an integer"),
// ];