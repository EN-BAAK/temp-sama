import { DataTypes, Model, Sequelize } from "sequelize";
import { PersonNoteAttributes, PersonNoteCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";

export class PersonNote extends Model<PersonNoteAttributes, PersonNoteCreationAttributes> implements PersonNoteAttributes {
  public id!: ID;
  public personId!: ID;
  public note!: string;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    PersonNote.belongsTo(models.Person, {
      foreignKey: "personId",
      as: "person",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  PersonNote.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      personId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "persons",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      note: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "person_notes",
      timestamps: false,
      indexes: [
        {
          fields: ["personId"],
        },
      ],
    }
  );

  return PersonNote;
};