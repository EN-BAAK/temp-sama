import { DataTypes, Model, Sequelize } from "sequelize";
import { ID } from "../types/variables";

export class UserPermission extends Model {
  public userId!: ID;
  public permissionId!: ID;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    UserPermission.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
    UserPermission.belongsTo(models.Permission, {
      foreignKey: "permissionId",
      as: "permission",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  UserPermission.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "users",
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
      tableName: "UserPermissions",
      timestamps: false,
      indexes: [
        {
          fields: ["permissionId"],
        },
      ],
    }
  );

  return UserPermission;
};