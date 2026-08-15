import { DataTypes, Model, Sequelize } from "sequelize";
import { GovernorateAttributes, GovernorateCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";

export class Governorate extends Model<GovernorateAttributes, GovernorateCreationAttributes> implements GovernorateAttributes {
  public id!: ID;
  public name!: string;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    Governorate.hasMany(models.City, {
      foreignKey: "governorateId",
      as: "cities",
      onDelete: "RESTRICT",
    });
  }
}

export default (sequelize: Sequelize) => {
  Governorate.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "governorates",
      timestamps: false,
    }
  );

  return Governorate;
};