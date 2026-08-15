import { DataTypes, Model, Sequelize } from "sequelize";
import { PropertyNoteAttributes, PropertyNoteCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";

export class PropertyNote
  extends Model<PropertyNoteAttributes, PropertyNoteCreationAttributes>
  implements PropertyNoteAttributes {
  public id!: ID;
  public propertyId!: ID;
  public note!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    PropertyNote.belongsTo(models.Property, {
      foreignKey: "propertyId",
      as: "property",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  PropertyNote.init(
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
      note: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      indexes: [
        { fields: ["propertyId"] }
      ],
      sequelize,
      tableName: "property_notes",
      timestamps: false,
    }
  );

  return PropertyNote;
};