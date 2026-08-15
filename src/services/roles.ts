import { Role } from "../modules/roles";
import { Permission } from "../modules/permissions";
import { Op } from "sequelize";
// import { RolePermission } from "../modules/rolePermissions";
// import { RoleCreationAttributes } from "../types/modules";
// import { ID } from "../types/variables";
// import ErrorHandler from "../middlewares/error";
// import { findRoleById, findRoleByName } from "../strategies/roles";
// import db from "../modules";

// export const getAllPermissions = async () => {
//   const permissions = await Permission.findAll({
//     order: [["name", "ASC"]],
//   });
//   return permissions.map((p) => p.toJSON());
// };

export const getAllRoles = async () => {
  const roles = await Role.findAll({
    where: {name: {[Op.notLike]: "مدير"}},
    include: [
      {
        model: Permission,
        as: "permissions",
        attributes: ["id", "name", "description"],
        through: { attributes: [] },
      },
    ],
    order: [["id", "ASC"]],
  });
  return roles.map((r) => r.toJSON());
};

// export const getRoleById = async (id: ID) => {
//   const role = await findRoleById({ id, relation: true })
//   return role;
// };

// export const createRole = async (data: RoleCreationAttributes) => {
//   const role = await findRoleByName({ name: data.name, error: false })

//   if (role)
//     throw new ErrorHandler("Role with this name already exists", 400);

//   const sequelize = db.sequelize
//   if (!sequelize) return

//   const transaction = await sequelize.transaction();

//   try {
//     const role = await Role.create(
//       {
//         name: data.name,
//         description: data.description,
//       },
//       { transaction }
//     );

//     if (data.permissionsIds && data.permissionsIds.length > 0) {
//       const permissionsCount = await Permission.count({
//         where: { id: data.permissionsIds },
//         transaction,
//       });

//       if (permissionsCount !== data.permissionsIds.length) {
//         throw new ErrorHandler("One or more provided permission IDs do not exist", 400);
//       }

//       const rolePermissionsData = data.permissionsIds.map((permissionId) => ({
//         roleId: role.id,
//         permissionId,
//       }));

//       await RolePermission.bulkCreate(rolePermissionsData, { transaction });
//     }

//     await transaction.commit();

//     return await findRoleById({ id: role.id, relation: true });
//   } catch (error) {
//     await transaction.rollback();
//     throw error;
//   }
// };

// export const updateRole = async (id: ID, data: Partial<RoleCreationAttributes>) => {
//   const role = await findRoleById({ id }) as Role

//   if (data.name && data.name !== role.name) {
//     const existingRole = await Role.findOne({ where: { name: data.name } });
//     if (existingRole) {
//       throw new ErrorHandler("Role with this name already exists", 400);
//     }
//   }

//   const sequelize = db.sequelize
//   if (!sequelize) return

//   const transaction = await sequelize.transaction();

//   try {
//     if (data.name !== undefined) role.name = data.name;
//     if (data.description !== undefined) role.description = data.description;
//     await role.save({ transaction });

//     if (data.permissionsIds !== undefined) {
//       if (data.permissionsIds.length > 0) {
//         const permissionsCount = await Permission.count({
//           where: { id: data.permissionsIds },
//           transaction,
//         });

//         if (permissionsCount !== data.permissionsIds.length) {
//           throw new ErrorHandler("One or more provided permission IDs do not exist", 400);
//         }
//       }

//       await RolePermission.destroy({ where: { roleId: id }, transaction });

//       if (data.permissionsIds.length > 0) {
//         const rolePermissionsData = data.permissionsIds.map((permissionId) => ({
//           roleId: id,
//           permissionId,
//         }));
//         await RolePermission.bulkCreate(rolePermissionsData, { transaction });
//       }
//     }

//     await transaction.commit();

//     return await findRoleById({ id, relation: true });
//   } catch (error) {
//     await transaction.rollback();
//     throw error;
//   }
// };

// export const deleteRole = async (id: ID) => {
//   const role = await findRoleById({ id }) as Role

//   await role.destroy();
//   return { id };
// };