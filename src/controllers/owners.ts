import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { getAllOwners, getOwnerById, createOwner, updateOwner, deleteOwnerById, unassignPropertyFromOwner, assignPropertyToOwner, getAllOwnerProperties, getAllOwnersIdentifiers } from "../services/owners";
import { ID } from "../types/variables";

export const getAll = catchAsyncErrors(async (req: Request, res: Response) => {
  const { p, l, s, o } = req.query

  const data = await getAllOwners({
    page: Number(p),
    limit: Number(l),
    search: s ? String(s) : "",
    offset: Number(o)
  });

  sendSuccessResponse(res, 200, "Owners fetched successfully", data);
});

export const getAllIdentified = catchAsyncErrors(async (_: Request, res: Response) => {
  const data = await getAllOwnersIdentifiers();
  sendSuccessResponse(res, 200, "Owners fetched successfully", data);
});

export const getById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const owner = await getOwnerById(id);

  sendSuccessResponse(res, 200, "Owner fetched successfully", owner);
});

export const getOwnerProperties = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const properties = await getAllOwnerProperties(id);

  sendSuccessResponse(res, 200, "Owner's properties fetched successfully", properties);
});

export const create = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = req.body;
  const owner = await createOwner(data);

  sendSuccessResponse(res, 201, "Owner created successfully", owner);
});

export const update = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const data = req.body;

  const owner = await updateOwner(id, data);

  sendSuccessResponse(res, 200, "Owner updated successfully", owner);
});

export const assignProperty = catchAsyncErrors(async (req: Request, res: Response) => {
  const ownerId = Number(req.params.ownerId) as ID;
  const propertyId = Number(req.params.propertyId) as ID;

  const property = await assignPropertyToOwner(ownerId, propertyId);

  sendSuccessResponse(res, 200, "Property assigned successfully", property);
});

export const unassignProperty = catchAsyncErrors(async (req: Request, res: Response) => {
  const ownerId = Number(req.params.ownerId) as ID;
  const propertyId = Number(req.params.propertyId) as ID;

  const result = await unassignPropertyFromOwner(ownerId, propertyId);

  sendSuccessResponse(res, 200, "Property unassigned successfully", result);
});

export const remove = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const data = await deleteOwnerById(id);

  sendSuccessResponse(res, 200, "Owner deleted successfully", data);
});