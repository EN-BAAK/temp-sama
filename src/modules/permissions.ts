import { DataTypes, Model, Sequelize } from "sequelize";
import { PermissionAttributes, PermissionCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";

export class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  public id!: ID;
  public name!: string;
  public description!: string | null;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    Permission.belongsToMany(models.Role, {
      through: models.RolePermission,
      foreignKey: "permissionId",
      otherKey: "roleId",
      as: "roles",
    });

    Permission.belongsToMany(models.User, {
      through: models.UserPermission,
      foreignKey: "permissionId",
      otherKey: "userId",
      as: "users",
    });

    Permission.hasMany(models.RolePermission, { foreignKey: "permissionId" });
    Permission.hasMany(models.UserPermission, { foreignKey: "permissionId" });
  }
}

export default (sequelize: Sequelize) => {
  Permission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "permissions",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["name"],
        },
      ],
    }
  );

  return Permission;
};