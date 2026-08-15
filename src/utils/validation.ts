import { body, param, query } from "express-validator";

export const positiveIntValidation = (field: string, location: "param" | "body" | "query" = "param") => {
  const validator = location === "param" ? param(field) : location === "body" ? body(field) : query(field);
  return validator
    .isInt({ min: 1 })
    .withMessage(`${field} must be a positive integer`);
};