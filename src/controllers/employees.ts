import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployeeById, getAllEmployeesIdentifiers, } from "../services/employees";
import { AuthenticatedRequest, ID } from "../types/variables";

export const getAll = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const { p, l, s, o } = req.query
  const id = req.id!

  const data = await getAllEmployees({
    page: Number(p),
    limit: Number(l),
    search: s ? String(s) : "",
    offset: Number(o),
    userId: id
  });

  sendSuccessResponse(res, 200, "Employees fetched successfully", data);
});

export const getById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const employee = await getEmployeeById(id);

  sendSuccessResponse(res, 200, "Employee fetched successfully", employee);
});

export const getAllIdentified = catchAsyncErrors(async (_: Request, res: Response) => {
  const data = await getAllEmployeesIdentifiers();
  sendSuccessResponse(res, 200, "Employees fetched successfully", data);
});

export const create = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = req.body;
  const employee = await createEmployee(data);

  sendSuccessResponse(res, 201, "Employee created successfully", employee);
});

export const update = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const data = req.body;

  const employee = await updateEmployee(id, data);

  sendSuccessResponse(res, 200, "Employee updated successfully", employee);
});

export const remove = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = Number(req.params.id) as ID;
  const data = await deleteEmployeeById(id);

  sendSuccessResponse(res, 200, "Employee deleted successfully", data);
});