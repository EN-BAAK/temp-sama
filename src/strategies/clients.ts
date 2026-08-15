import ErrorHandler from "../middlewares/error";
import { City } from "../modules/cities";
import { ClientFavorite } from "../modules/clientFavorites";
import { Client } from "../modules/clients";
import { Person } from "../modules/persons";
import { findClientByIdProps, findClientFavoriteByIdProps } from "../types/strategies";

export const formatClientResponse = (clientInstance: Client) => {
  const client = clientInstance.toJSON() as any
  const person = client.person || {}

  return {
    id: client.personId,
    fullName: person.fullName || null,
    phone: person.phone || null,
    email: person.email || null,
    city: person.city || null,
    budget: client.budget ?? null,
    createdAt: person.createdAt,
    updatedAt: person.updatedAt,
  };
};

export const findClientById = async ({ id, relation = false, transaction }: findClientByIdProps) => {
  const includes = relation ? [
    {
      model: Person,
      as: "person",
      include: [
        {
          model: City,
          as: "city",
          attributes: ["id", "name"],
        },
      ],
    }
  ] : undefined

  const client = await Client.findByPk(id, {
    transaction,
    include: includes
  });

  if (!client) {
    throw new ErrorHandler("Client not found", 404);
  }

  return relation ? formatClientResponse(client) : client;
}

export const findClientFavoriteById = async ({ clientId, propertyId, transaction }: findClientFavoriteByIdProps) => {
  const favorite = await ClientFavorite.findOne({
    where: {
      clientId,
      propertyId,
    },
    transaction
  });

  if (!favorite) {
    throw new ErrorHandler("Favorite entry not found", 404);
  }

  return favorite;
}