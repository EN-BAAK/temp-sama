import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { AuthenticatedRequest, ID } from "../types/variables";
import * as services from "../services/auth"
import settings from "../config/settings";

export const verifyUser = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const id = req.id!;
  await services.verifyUser(id);
  sendSuccessResponse(res, 200, "User is verified", req.user);
});

export const changePassword = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const id = req.id!;
  const { password, newPassword } = req.body;
  const result = await services.changePassword(id, password, newPassword);
  sendSuccessResponse(res, 200, result.message);
});

export const login = catchAsyncErrors(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await services.login(email, password);

  res.cookie(settings.authCookieName, result.token, {
    httpOnly: true,
    secure: settings.nodeEnvironment === "production",
    sameSite: "strict" as const,
    maxAge: settings.authCookieMaxAgeMs,
  });

  sendSuccessResponse(res, 200, "Login successful", result);
});

export const logout = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.id as ID
  await services.logout(userId);

  res.clearCookie(settings.authCookieName, {
    httpOnly: true,
    secure: settings.nodeEnvironment === "production",
    sameSite: "strict",
  });

  sendSuccessResponse(res, 200, "Logged out successfully", null);
});

export const forgotPassword = catchAsyncErrors(async (req: Request, res: Response) => {
  const email = req.params.email as string;
  const result = await services.forgotPassword(email);
  sendSuccessResponse(res, 200, result.message);
});

export const resetForgottenPassword = catchAsyncErrors(async (req: Request, res: Response) => {
  const { otp, password } = req.body;
  const result = await services.resetForgottenPassword(otp, password);
  sendSuccessResponse(res, 200, result.message);
});