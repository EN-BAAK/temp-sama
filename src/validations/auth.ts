import { body, param } from "express-validator";

export const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .trim()
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString(),
];

export const changePasswordValidation = [
  body("password")
    .notEmpty()
    .withMessage("Old password is required")
    .isString(),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    .custom((value, { req }) => {
      if (value === req.body?.password) {
        throw new Error("New password must be different from the old password");
      }
      return true;
    }),
];

export const forgotPasswordValidation = [
  param("email").isEmail().withMessage("Valid email is required"),
];

export const resetForgottenPasswordValidation = [
  body("otp").notEmpty().withMessage("Reset code is required"),
  body("password").isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
];