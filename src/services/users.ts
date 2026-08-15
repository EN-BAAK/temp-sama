import { User } from "../modules/users";
import { ID } from "../types/variables";
import { ServiceOptions } from "../types/services";
import { findUserById } from "../strategies/users";
import { hashPassword } from "../utils/encrypt";
import { findRoleById } from "../strategies/roles";
import { findPersonById } from "../strategies/persons";
import ErrorHandler from "../middlewares/error";

export const createUser = async (data: any, options?: ServiceOptions) => {
  const transaction = options?.transaction;

  await findPersonById({
    id: data.personId,
    transaction
  })

  if (data.roleId)
    await findRoleById({ id: data.roleId, transaction })

  const existingUser = await User.findOne({
    where: { personId: data.personId },
    transaction
  });

  if (existingUser)
    throw new ErrorHandler("Person already has a user account", 400);

  const hashedPassword = await hashPassword(data.password);

  const createdUser = await User.create(
    {
      personId: data.personId,
      password: hashedPassword,
      roleId: data.roleId,
    },
    { transaction }
  );

  if (data.permissionIds && Array.isArray(data.permissionIds)) {
    await (createdUser as any).setPermissions(data.permissionIds, { transaction });
  }

  const user = await findUserById({
    id: createdUser.personId,
    relational: true,
    transaction
  });

  return user;
};

export const updateUser = async (id: ID, data: any, options?: ServiceOptions) => {
  const transaction = options?.transaction;

  const userToUpdate = await findUserById({
    id,
    transaction
  }) as any

  if (data.roleId)
    await findRoleById({ id: data.roleId, transaction })

  const updateData: any = {};

  if (data.password)
    updateData.password = await hashPassword(data.password)

  if (data.roleId !== undefined)
    updateData.roleId = data.roleId

  Object.assign(userToUpdate, updateData);

  await userToUpdate.save({ transaction });

  if (data.permissionIds && Array.isArray(data.permissionIds)) {
    await userToUpdate.setPermissions(data.permissionIds, { transaction });
  }

  const user = await findUserById({
    id,
    relational: true,
    transaction
  });

  return user;
};

export const deleteUserById = async (id: ID, options?: ServiceOptions) => {
  const transaction = options?.transaction;

  const user = await findUserById({
    id,
    transaction
  }) as User

  await user.destroy({ transaction });

  return { id };
};