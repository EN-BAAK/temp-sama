import { DataTypes, Model, Sequelize } from "sequelize";
import { ID } from "../types/variables";

export class RolePermission extends Model {
  public roleId!: ID;
  public permissionId!: ID;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    RolePermission.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
      onDelete: "CASCADE",
    });
    RolePermission.belongsTo(models.Permission, {
      foreignKey: "permissionId",
      as: "permission",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  RolePermission.init(
    {
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "roles",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "permissions",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      tableName: "RolePermissions",
      timestamps: false,
      indexes: [
        {
          fields: ["permissionId"],
        },
      ],
    }
  );

  return RolePermission;
};