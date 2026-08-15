import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { getAllPropertyFeatures } from "../services/propertyFeatures";

export const getAll = catchAsyncErrors(async (_: Request, res: Response) => {
  const data = await getAllPropertyFeatures();
  sendSuccessResponse(res, 200, "Features fetched successfully", data);
});