import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { getAllGovernorates, getGovernorateById, createGovernorate, updateGovernorate, deleteGovernorateById, createCity, updateCityName, deleteCityById, getAllCities as getAllCitiesService } from "../services/governorates";
import { ID } from "../types/variables";

export const getAllGovs = catchAsyncErrors(async (_: Request, res: Response) => {
  const data = await getAllGovernorates();
  sendSuccessResponse(res, 200, "Governorates fetched successfully", data);
});

export const getGovById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const data = await getGovernorateById(id);
  sendSuccessResponse(res, 200, "Governorate fetched successfully", data);
});

export const createGov = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = await createGovernorate(req.body);
  sendSuccessResponse(res, 201, "Governorate created successfully", data);
});

export const updateGov = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const data = await updateGovernorate(id, req.body);
  sendSuccessResponse(res, 200, "Governorate updated successfully", data);
});

export const removeGov = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const data = await deleteGovernorateById(id);
  sendSuccessResponse(res, 200, "Governorate deleted successfully", data);
});

export const getAllCities = catchAsyncErrors(async (_: Request, res: Response) => {
  const data = await getAllCitiesService();
  sendSuccessResponse(res, 200, "Cities fetched successfully", data);
});


export const createCityController = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID
  const data = req.body;
  const result = await createCity({ governorateId: id, name: data.name });
  sendSuccessResponse(res, 201, "City created successfully", result);
});

export const updateCityNameController = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const { name } = req.body;
  const data = await updateCityName(id, name);
  sendSuccessResponse(res, 200, "City updated successfully", data);
});

export const removeCityController = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const data = await deleteCityById(id);
  sendSuccessResponse(res, 200, "City deleted successfully", data);
});