import { DataTypes, Model, Sequelize } from "sequelize";
import { CategoryAttributes, CategoryCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: ID;
  public name!: string;
  public icon!: string;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    Category.hasMany(models.Property, {
      foreignKey: "categoryId",
      as: "properties",
      onDelete: "RESTRICT",
    });
  }
}

export default (sequelize: Sequelize) => {
  Category.init(
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
      icon: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "categories",
      timestamps: false,
    }
  );

  return Category;
};