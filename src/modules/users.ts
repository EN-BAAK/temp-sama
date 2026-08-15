import { DataTypes, Model, Sequelize } from "sequelize";
import { UserAttributes, UserCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public personId!: ID;
  public password!: string;
  public roleId!: ID;

  public toJSON(): object {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }

  static associate(models: any) {
    User.belongsTo(models.Person, {
      foreignKey: "personId",
      as: "person",
      onDelete: "CASCADE",
    });

    User.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
    });

    User.belongsToMany(models.Permission, {
      through: models.UserPermission,
      foreignKey: "userId",
      otherKey: "permissionId",
      as: "permissions",
    });

    User.hasMany(models.UserPermission, {
      foreignKey: "userId",
    });

    User.hasOne(models.PasswordReset, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  }
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      personId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        references: {
          model: "persons",
          key: "id",
        },
        unique: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        defaultValue: 1,
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["personId"],
        },
        {
          fields: ["roleId"],
        },
      ],
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
      },
    }
  );

  return User;
};