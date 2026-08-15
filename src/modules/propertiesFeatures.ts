import { DataTypes, Model, Sequelize } from "sequelize";
import { ID } from "../types/variables";

export class PropertiesFeatures extends Model {
  public propertyId!: ID;
  public featureId!: ID;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    PropertiesFeatures.belongsTo(models.Property, {
      foreignKey: "propertyId",
      as: "property",
      onDelete: "CASCADE",
    });
    PropertiesFeatures.belongsTo(models.PropertyFeature, {
      foreignKey: "featureId",
      as: "feature",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  PropertiesFeatures.init(
    {
      propertyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "properties",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      featureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "features",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      tableName: "properties_features",
      timestamps: false,
      indexes: [
        {
          fields: ["featureId"],
        },
      ],
    }
  );

  return PropertiesFeatures;
};