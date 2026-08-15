import { DataTypes, Model, Sequelize } from "sequelize";
import { OwnerAttributes, OwnerCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";

export class Owner extends Model<OwnerAttributes, OwnerCreationAttributes> implements OwnerAttributes {
  public personId!: ID;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    Owner.belongsTo(models.Person, {
      foreignKey: "personId",
      as: "person",
      onDelete: "CASCADE",
    });

    Owner.hasMany(models.Property, {
      foreignKey: "ownerId",
      as: "properties",
      onDelete: "SET NULL",
    });
  }
}

export default (sequelize: Sequelize) => {
  Owner.init(
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
      tableName: "owners",
      timestamps: false,
    }
  );

  return Owner;
};