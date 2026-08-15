import { DataTypes, Model, Sequelize } from "sequelize";
import { EmployeeAttributes, EmployeeCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";

export class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
  public personId!: ID;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    Employee.belongsTo(models.Person, {
      foreignKey: "personId",
      as: "person",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Employee.init(
    {
      personId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "persons",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      tableName: "employees",
      timestamps: false,
    }
  );

  return Employee;
};