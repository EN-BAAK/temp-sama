import { DataTypes, Model, Sequelize } from "sequelize";
import { PropertyAttributes, PropertyCreationAttributes, } from "../types/modules";
import { ID, PropertyDuration, PropertyPurpose, PropertyStatus } from "../types/variables";
import { safeUnlink } from "../utils/multer";
import { PropertiesFeatures } from "./propertiesFeatures";

export class Property
  extends Model<PropertyAttributes, PropertyCreationAttributes>
  implements PropertyAttributes {
  public id!: ID;
  public title!: string | null;
  public location!: string | null;
  public cityId!: ID | null;
  public bedrooms!: number | null;
  public bathrooms!: number | null;
  public area!: number | null;
  public categoryId!: ID;
  public desc!: string | null;
  public backgroundUrl!: string | null;
  public ownerId!: ID | null;
  public map!: string | null;
  public status!: PropertyStatus;
  public price!: number;
  public duration!: PropertyDuration | null;
  public purpose!: PropertyPurpose | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public toJSON(): object {
    const json = { ...this.get() }
    return { ...json, cityId: undefined, categoryId: undefined, ownerId: undefined };
  }

  public toJSONSettings(): object {
    const json = { ...this.get() }
    return { ...json };
  }

  static associate(models: any) {
    Property.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
      onDelete: "RESTRICT",
    });

    Property.belongsTo(models.City, {
      foreignKey: "cityId",
      as: "city",
      onDelete: "RESTRICT",
    });

    Property.belongsTo(models.Owner, {
      foreignKey: "ownerId",
      as: "owner",
      onDelete: "SET NULL",
    });

    Property.hasMany(models.PropertyImage, {
      foreignKey: "propertyId",
      as: "images",
      onDelete: "CASCADE",
    });

    Property.belongsToMany(models.PropertyFeature, {
      through: PropertiesFeatures,
      foreignKey: "propertyId",
      otherKey: "featureId",
      as: "features",
    });

    Property.hasMany(models.PropertyNote, {
      foreignKey: "propertyId",
      as: "notes",
      onDelete: "CASCADE",
    });

    Property.hasMany(models.PropertyPlan, {
      foreignKey: "propertyId",
      as: "plans",
      onDelete: "CASCADE",
    });

    Property.hasMany(models.ClientFavorite, {
      foreignKey: "propertyId",
      as: "favorites",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Property.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
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
      bedrooms: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bathrooms: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      area: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      desc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      backgroundUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "owners",
          key: "personId",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      map: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(PropertyStatus)),
        allowNull: false,
        defaultValue: PropertyStatus.AVAILABLE
      },
      price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      duration: {
        type: DataTypes.ENUM(...Object.values(PropertyDuration)),
        allowNull: true,
        defaultValue: PropertyDuration.YEARLY,
      },
      purpose: {
        type: DataTypes.ENUM(...Object.values(PropertyPurpose)),
        allowNull: true,
        defaultValue: PropertyPurpose.RENT,
      },
    },
    {
      sequelize,
      tableName: "properties",
      timestamps: true,
      indexes: [
        { fields: ["cityId"] },
        { fields: ["categoryId"] },
        { fields: ["ownerId"] },
        { fields: ["status", "purpose"] },
        { fields: ["price"] },
      ],
      hooks: {
        beforeDestroy: async (property: Property) => {
          if (property.backgroundUrl) {
            try {
              safeUnlink(property.backgroundUrl)
            } catch (err) {
              console.log("Failed to delete product image:", err);
            }
          }
        },
      }
    }
  );

  return Property;
};