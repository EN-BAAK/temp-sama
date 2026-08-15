import { DataTypes, Model, Sequelize } from "sequelize";
import { FeatureAttributes, FeatureCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";
import { PropertiesFeatures } from "./propertiesFeatures";

export class PropertyFeature
  extends Model<FeatureAttributes, FeatureCreationAttributes>
  implements FeatureAttributes {
  public id!: ID;
  public name!: string;
  public color!: string | null;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    PropertyFeature.belongsToMany(models.Property, {
      through: PropertiesFeatures,
      foreignKey: "featureId",
      otherKey: "propertyId",
      as: "properties",
    });
  }
}

export default (sequelize: Sequelize) => {
  PropertyFeature.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "property_features",
      timestamps: false,
    }
  );

  return PropertyFeature;
};