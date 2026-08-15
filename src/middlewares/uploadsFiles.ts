import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { safeUnlink } from "../utils/multer";
import ErrorHandler from "./error";

export const validateAndCleanup = (req: Request, _: Response, next: NextFunction) => {
  const errors = validationResult(req);
  console.log("Errors", errors)
  if (!errors.isEmpty()) {
    if (req.files) {
      const filesObj = req.files as { [fieldname: string]: Express.Multer.File[] };
      Object.keys(filesObj).forEach((key) => {
        filesObj[key].forEach((file) => safeUnlink(file.path));
      });
    } else if (req.file) {
      safeUnlink(req.file.path);
    }

    next(new ErrorHandler("Internal server error", 500))
  }
  next();
};