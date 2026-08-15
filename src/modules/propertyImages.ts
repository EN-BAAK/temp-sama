import { DataTypes, Model, Sequelize } from "sequelize";
import { PropertyImageAttributes, PropertyImageCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";
import { safeUnlink } from "../utils/multer";

export class PropertyImage
  extends Model<PropertyImageAttributes, PropertyImageCreationAttributes>
  implements PropertyImageAttributes {
  public id!: ID;
  public propertyId!: ID;
  public imageUrl!: string;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    PropertyImage.belongsTo(models.Property, {
      foreignKey: "propertyId",
      as: "property",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  PropertyImage.init(
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
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      indexes: [
        { fields: ["propertyId"] }
      ],
      sequelize,
      tableName: "property_images",
      timestamps: false,
      hooks: {
        afterDestroy: async (image: PropertyImage) => {
          if (!image.imageUrl) return;

          try {
            await safeUnlink(image.imageUrl);
          } catch (error) {
            console.error(
              `Failed to delete property image: ${image.imageUrl}`,
              error
            );
          }
        },
      },
    }
  );

  return PropertyImage;
};