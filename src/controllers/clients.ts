import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { getAllClients, getClientById, createClient, updateClient, deleteClientById, getClientFavorites, getClientUnfavoriteProperties, addClientFavorite, removeClientFavorite, getAllClientsIdentifiers } from "../services/clients";
import { ID } from "../types/variables";

export const getAll = catchAsyncErrors(async (req: Request, res: Response) => {
  const { p, l, s, o } = req.query

  const data = await getAllClients({
    page: Number(p),
    limit: Number(l),
    search: s ? String(s) : "",
    offset: Number(o)
  });

  sendSuccessResponse(res, 200, "Clients fetched successfully", data);
});

export const getAllIdentified = catchAsyncErrors(async (_: Request, res: Response) => {
  const data = await getAllClientsIdentifiers();
  sendSuccessResponse(res, 200, "Clients fetched successfully", data);
});

export const getById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const client = await getClientById(id);

  sendSuccessResponse(res, 200, "Client fetched successfully", client);
});

export const create = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = req.body;
  const client = await createClient(data);

  sendSuccessResponse(res, 201, "Client created successfully", client);
});

export const update = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const data = req.body;

  const client = await updateClient(id, data);

  sendSuccessResponse(res, 200, "Client updated successfully", client);
});

export const remove = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const data = await deleteClientById(id);

  sendSuccessResponse(res, 200, "Client deleted successfully", data);
});

export const getFavorites = catchAsyncErrors(async (req: Request, res: Response) => {
  const clientId = Number(req.params.clientId) as ID;
  const data = await getClientFavorites(clientId);
  sendSuccessResponse(res, 200, "Client favorites properties fetched successfully", data);
});

export const getUnFavorites = catchAsyncErrors(async (req: Request, res: Response) => {
  const clientId = Number(req.params.clientId) as ID;
  const data = await getClientUnfavoriteProperties(clientId);
  sendSuccessResponse(res, 200, "Client unfavorite properties fetched successfully", data);
});

export const createFavorite = catchAsyncErrors(async (req: Request, res: Response) => {
  const clientId = Number(req.params.clientId) as ID;
  const propertyId = Number(req.params.propertyId) as ID;

  const result = await addClientFavorite(clientId, propertyId);
  sendSuccessResponse(res, 201, "A property has been added to favorite list successfully", result);
});

export const deleteFavorite = catchAsyncErrors(async (req: Request, res: Response) => {
  const clientId = Number(req.params.clientId) as ID;
  const propertyId = Number(req.params.propertyId) as ID;

  const result = await removeClientFavorite(clientId, propertyId);
  sendSuccessResponse(res, 200, "A property has been removed from favorite list successfully", result);
});