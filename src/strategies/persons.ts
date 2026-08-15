import ErrorHandler from "../middlewares/error";
import { City } from "../modules/cities";
import { Person } from "../modules/persons";
import { PersonNote } from "../modules/personNotes";
import { findPersonByIdProps, findPersonNoteByIdProps } from "../types/strategies";

export const findPersonById = async ({ id, relation = false, transaction }: findPersonByIdProps) => {
  const includes = relation ? [
    {
      model: City,
      as: "city",
      attributes: ["id", "name"],
    },
  ] : undefined

  const person = await Person.findByPk(id, {
    transaction,
    include: includes
  });

  if (!person) {
    throw new ErrorHandler("Person not found", 404);
  }

  return relation ? person?.toJSON() : person;
}

export const findPersonNoteById = async ({ id, personId, isJson = false, transaction }: findPersonNoteByIdProps) => {
  const note = await PersonNote.findOne({
    where: {
      id,
      personId,
    },
    transaction
  });

  if (!note) {
    throw new ErrorHandler("Person note not found", 404);
  }

  return isJson ? note?.toJSON() : note;
}