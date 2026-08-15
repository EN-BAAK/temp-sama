import { DataTypes, Model, Sequelize } from "sequelize";
import { CityAttributes, CityCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";

export class City extends Model<CityAttributes, CityCreationAttributes> implements CityAttributes {
  public id!: ID;
  public name!: string;
  public governorateId!: ID;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    City.belongsTo(models.Governorate, {
      foreignKey: "governorateId",
      as: "governorate",
      onDelete: "RESTRICT",
    });

    City.hasMany(models.Property, {
      foreignKey: "cityId",
      as: "properties",
      onDelete: "SET NULL",
    });
  }
}

export default (sequelize: Sequelize) => {
  City.init(
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
      governorateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "governorates",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      tableName: "cities",
      timestamps: false,
      indexes: [
        { fields: ["governorateId"] }
      ]
    }
  );

  return City;
};