import ErrorHandler from "../middlewares/error";
import { City } from "../modules/cities";
import { Owner } from "../modules/owners";
import { Person } from "../modules/persons";
import { findOwnerByIdProps } from "../types/strategies";

export const formatOwnerResponse = (ownerInstance: Owner) => {
  const owner = ownerInstance.toJSON() as any
  const person = owner.person || {}

  return {
    id: owner.personId,
    fullName: person.fullName || null,
    email: person.email || null,
    phone: person.phone || null,
    city: person.city || null,
    createdAt: person.createdAt,
    updatedAt: person.updatedAt,
  };
};

export const findOwnerById = async ({ id, relation = false, transaction }: findOwnerByIdProps) => {
  const includes = relation ? [
    {
      model: Person,
      as: "person",
      include: [
        {
          model: City,
          as: "city",
          attributes: ["id", "name"],
        }
      ],
    }
  ] : undefined

  const owner = await Owner.findByPk(id, {
    transaction,
    include: includes
  });

  if (!owner) {
    throw new ErrorHandler("Owner not found", 404);
  }

  return relation ? formatOwnerResponse(owner) : owner;
}