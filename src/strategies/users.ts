import ErrorHandler from "../middlewares/error";
import { Person } from "../modules/persons";
import { Permission } from "../modules/permissions";
import { Role } from "../modules/roles";
import { User } from "../modules/users";
import { findUserByIdProps } from "../types/strategies";

export const findUserById = async ({ id, handleError = true, relational = false, transaction }: findUserByIdProps) => {
  const includes = relational ?
    [
      {
        model: Person,
        as: "person",
      },
      {
        model: Role,
        as: "role",
        include: [{ model: Permission, as: "permissions" }],
      },
      {
        model: Permission,
        as: "permissions",
      },
    ] : undefined

  const user = await User.findByPk(id, {
    include: includes,
    transaction
  });

  if (!user && handleError) {
    throw new ErrorHandler("User not found", 404);
  }

  return relational ? user?.toJSON() : user;
}