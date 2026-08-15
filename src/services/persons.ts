import { Person } from "../modules/persons";
import { PersonNote } from "../modules/personNotes";
import { PersonCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";
import { ServiceOptions } from "../types/services";
import { findPersonById, findPersonNoteById } from "../strategies/persons";
import { findCityById } from "../strategies/governorates";

export const createPerson = async (data: PersonCreationAttributes, options?: ServiceOptions) => {
  const transaction = options?.transaction;

  if (data.cityId)
    await findCityById({ id: data.cityId, transaction })

  const person = await Person.create(
    {
      fullName: data.fullName,
      email: data.email || null,
      phone: data.phone || null,
      cityId: data.cityId || null,
    },
    { transaction }
  );

  return person;
};

export const updatePerson = async (id: ID, data: Partial<PersonCreationAttributes>, options?: ServiceOptions) => {
  const transaction = options?.transaction;

  const person = await findPersonById({
    id,
    transaction
  }) as Person

  if (data.cityId)
    await findCityById({ id: data.cityId, transaction })

  Object.assign(person, data);

  await person.save({ transaction });

  return person;
};

export const deletePersonById = async (id: ID, options?: ServiceOptions) => {
  const transaction = options?.transaction;

  const person = await findPersonById({
    id,
    transaction
  }) as Person

  await person.destroy({ transaction });

  return { id };
};

export const getPersonNotesByPersonId = async (personId: ID) => {
  await findPersonById({ id: personId })

  const notes = await PersonNote.findAll({
    where: { personId },
    order: [["id", "DESC"]],
  });

  return notes.map((note) => note.toJSON());
};

export const createPersonNote = async (personId: ID, noteText: string) => {
  await findPersonById({ id: personId })

  const newNote = await PersonNote.create({
    personId,
    note: noteText,
  });

  return newNote.toJSON();
};

export const deletePersonNoteById = async (personId: ID, noteId: ID) => {
  const note = await findPersonNoteById({
    id: noteId,
    personId
  }) as PersonNote

  await note.destroy();

  return { id: noteId };
};