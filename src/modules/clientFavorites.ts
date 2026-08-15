import { DataTypes, Model, Sequelize } from "sequelize";
import { ClientFavoriteAttributes, ClientFavoriteCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";

export class ClientFavorite
  extends Model<ClientFavoriteAttributes, ClientFavoriteCreationAttributes>
  implements ClientFavoriteAttributes {
  public id!: ID;
  public clientId!: ID;
  public propertyId!: ID;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    ClientFavorite.belongsTo(models.Client, {
      foreignKey: "clientId",
      as: "client",
      onDelete: "CASCADE",
    });

    ClientFavorite.belongsTo(models.Property, {
      foreignKey: "propertyId",
      as: "property",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  ClientFavorite.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "clients",
          key: "personId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
    },
    {
      sequelize,
      tableName: "client_favorites",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["clientId", "propertyId"],
        },
        {
          fields: ["propertyId"],
        },
      ],
    }
  );

  return ClientFavorite;
};