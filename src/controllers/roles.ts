import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { getAllRoles } from "../services/roles";
import { sendSuccessResponse } from "../middlewares/success";
// import { getAllPermissions, getAllRoles, getRoleById, createRole, updateRole, deleteRole, } from "../services/roles";
// import { ID } from "../types/variables";

// export const getPermissions = catchAsyncErrors(async (_: Request, res: Response) => {
//   const data = await getAllPermissions();
//   sendSuccessResponse(res, 200, "Permissions fetched successfully", data);
// });

export const getRoles = catchAsyncErrors(async (_: Request, res: Response) => {
  const data = await getAllRoles();
  sendSuccessResponse(res, 200, "Roles fetched successfully", data);
});

// export const getRole = catchAsyncErrors(async (req: Request, res: Response) => {
//   const id = Number(req.params.id) as ID;
//   const data = await getRoleById(id);
//   sendSuccessResponse(res, 200, "Role fetched successfully", data);
// });

// export const createRoleController = catchAsyncErrors(async (req: Request, res: Response) => {
//   const data = await createRole(req.body);
//   sendSuccessResponse(res, 201, "Role created successfully", data);
// });

// export const updateRoleController = catchAsyncErrors(async (req: Request, res: Response) => {
//   const id = Number(req.params.id) as ID;
//   const data = await updateRole(id, req.body);
//   sendSuccessResponse(res, 200, "Role updated successfully", data);
// });

// export const deleteRoleController = catchAsyncErrors(async (req: Request, res: Response) => {
//   const id = Number(req.params.id) as ID;
//   const data = await deleteRole(id);
//   sendSuccessResponse(res, 200, "Role deleted successfully", data);
// });