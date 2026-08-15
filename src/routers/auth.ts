import { Router } from "express";
import { login, logout, changePassword, verifyUser, forgotPassword, resetForgottenPassword } from "../controllers/auth";
import { loginValidation, changePasswordValidation, forgotPasswordValidation, resetForgottenPasswordValidation } from "../validations/auth";
import { verifyAuthentication } from "../middlewares/auth";
import { validation } from "../middlewares/error";

const router = Router();

router.get("/verify-me", verifyAuthentication, verifyUser);

router.post("/login", loginValidation, validation, login);
router.post("/logout", verifyAuthentication, logout);

router.put("/change-password", verifyAuthentication, changePasswordValidation, validation, changePassword);

router.patch("/forgot-password/:email", forgotPasswordValidation, validation, forgotPassword);
router.patch("/reset-password", resetForgottenPasswordValidation, validation, resetForgottenPassword);

export default router;