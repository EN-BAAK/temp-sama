import { NextFunction, Response } from "express";
import ErrorHandler from "./error";
import { AuthenticatedRequest } from "../types/variables";

export const authorize = (requiredPermission: string) => {
  return (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new ErrorHandler("Unauthorized", 401));
    }

    const rolePermissions = user.role?.map((p: any) => p) || [];
    const directPermissions = user.permissions?.map((p: any) => p) || [];
    const allPermissions = new Set([...rolePermissions, ...directPermissions]);

    if (allPermissions.has("admin.all") || allPermissions.has(requiredPermission)) {
      return next();
    }

    return next(new ErrorHandler("Forbidden: You do not have permission", 403));
  };
};