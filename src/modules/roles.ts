import { DataTypes, Model, Sequelize } from "sequelize";
import { RoleAttributes, RoleCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: ID;
  public name!: string;
  public description!: string | null;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    Role.hasMany(models.User, {
      foreignKey: "roleId",
      as: "users",
    });

    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: "roleId",
      otherKey: "permissionId",
      as: "permissions",
    });

    Role.hasMany(models.RolePermission, { foreignKey: "roleId" });
  }
}

export default (sequelize: Sequelize) => {
  Role.init(
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
      tableName: "roles",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["name"],
        },
      ],
    }
  );

  return Role;
};