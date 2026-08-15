import { DataTypes, Model, Sequelize } from "sequelize";
import { ClientAttributes, ClientCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";

export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public personId!: ID;
  public budget!: number | null;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    Client.belongsTo(models.Person, {
      foreignKey: "personId",
      as: "person",
      onDelete: "CASCADE",
    });

    Client.hasMany(models.ClientFavorite, {
      foreignKey: "clientId",
      as: "favorites",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Client.init(
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
      budget: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "clients",
      timestamps: false,
    }
  );

  return Client;
};