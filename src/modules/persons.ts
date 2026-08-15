import { DataTypes, Model, Sequelize } from "sequelize";
import { PersonAttributes, PersonCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";

export class Person extends Model<PersonAttributes, PersonCreationAttributes> implements PersonAttributes {
  public id!: ID;
  public fullName!: string;
  public email!: string | null;
  public phone!: string | null;
  public cityId!: ID | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public toJSON(): object {
    const json = this.get()
    return { ...json, cityId: undefined };
  }

  static associate(models: any) {
    Person.belongsTo(models.City, {
      foreignKey: "cityId",
      as: "city",
      onDelete: "SET NULL",
    });

    Person.hasOne(models.User, {
      foreignKey: "personId",
      as: "user",
      onDelete: "CASCADE",
    });

    Person.hasOne(models.Client, {
      foreignKey: "personId",
      as: "client",
      onDelete: "CASCADE",
    });

    Person.hasOne(models.Owner, {
      foreignKey: "personId",
      as: "owner",
      onDelete: "CASCADE",
    });

    Person.hasOne(models.Employee, {
      foreignKey: "personId",
      as: "employee",
      onDelete: "CASCADE",
    });

    Person.hasMany(models.PersonNote, {
      foreignKey: "personId",
      as: "notes",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Person.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "cities",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      tableName: "persons",
      timestamps: true,
      indexes: [
        {
          fields: ["fullName"],
        },
        {
          fields: ["email"],
        },
        {
          fields: ["phone"],
        },
        {
          fields: ["cityId"],
        },
      ],
    }
  );

  return Person;
};