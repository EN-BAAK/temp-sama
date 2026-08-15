import ErrorHandler from "../middlewares/error";
import { Permission } from "../modules/permissions";
import { Role } from "../modules/roles";
import { findRoleByIdProps, findRoleByNameProps } from "../types/strategies";

export const findRoleById = async ({ id, relation = false, transaction }: findRoleByIdProps) => {
  const includes = relation ? [
    {
      model: Permission,
      as: "permissions",
      attributes: ["id", "name", "description"],
      through: { attributes: [] },
    },
  ] : undefined

  const role = await Role.findByPk(id, { transaction, include: includes });
  if (!role) {
    throw new ErrorHandler("Role not found", 404);
  }

  return relation ? role.toJSON() : role;
}

export const findRoleByName = async ({ name, isJson = false, transaction, error = true }: findRoleByNameProps) => {
  const role = await Role.findOne({ where: { name }, transaction });
  if (!role && error) {
    throw new ErrorHandler("Role not found", 404);
  }

  return isJson ? role?.toJSON() : role;
}