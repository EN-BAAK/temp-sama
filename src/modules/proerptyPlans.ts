import { DataTypes, Model, Sequelize } from "sequelize";
import { PropertyPlanAttributes, PropertyPlanCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";
import { safeUnlink } from "../utils/multer";

export class PropertyPlan extends Model<PropertyPlanAttributes, PropertyPlanCreationAttributes>
  implements PropertyPlanAttributes {
  public id!: ID;
  public propertyId!: ID;
  public fileUrl!: string;
  public extension!: string;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    PropertyPlan.belongsTo(models.Property, {
      foreignKey: "propertyId",
      as: "property",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  PropertyPlan.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      propertyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "properties",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      extension: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "property_plans",
      timestamps: false,
      indexes: [{ fields: ["propertyId"] }],
      hooks: {
        afterDestroy: async (plan: PropertyPlan) => {
          if (!plan.fileUrl) return;

          try {
            await safeUnlink(plan.fileUrl);
          } catch (error) {
            console.error(
              `Failed to delete property plan file: ${plan.fileUrl}`,
              error
            );
          }
        },
      },
    }
  );

  return PropertyPlan;
};