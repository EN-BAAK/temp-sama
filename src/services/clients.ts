import { Op } from "sequelize";
import db from "../modules";
import { Client } from "../modules/clients";
import { Person } from "../modules/persons";
import { ID } from "../types/variables";
import { getAllClientsProps } from "../types/services";
import { findClientById, findClientFavoriteById, formatClientResponse } from "../strategies/clients";
import { createPerson, updatePerson, deletePersonById } from "./persons";
import { City } from "../modules/cities";
import ErrorHandler from "../middlewares/error";
import { findPropertyById } from "../strategies/properties";
import { ClientFavorite } from "../modules/clientFavorites";
import { Property } from "../modules/properties";
import { Category } from "../modules/categories";

export const getAllClients = async (query: getAllClientsProps) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offsetUnit = Number(query.offset) || 0
  const offset = (page - 1) * limit + offsetUnit;
  const search = query.search

  const personWhereClause: any = {};

  if (search) {
    personWhereClause[Op.or] = [
      { fullName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { phone: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { count, rows } = await Client.findAndCountAll({
    include: [
      {
        model: Person,
        as: "person",
        where: personWhereClause,
        include: [
          {
            model: City,
            as: "city",
            attributes: ["id", "name"],
          }
        ],
      }
    ],
    limit,
    offset,
    order: [[{ model: Person, as: "person" }, "createdAt", "DESC"]],
  });

  const totalPages = Math.ceil(count / limit);

  return {
    items: rows.map((client) => formatClientResponse(client)),
    page,
    limit,
    total: count,
    totalPages,
    nextPage: page < totalPages ? page + 1 : false,
    prevPage: page > 1 ? page - 1 : false,
  };
};

export const getAllClientsIdentifiers = async () => {
  const clients = await Client.findAll({
    attributes: [],
    include: {
      model: Person,
      as: "person",
      attributes: ["id", "fullName", "phone"]
    }
  })

  const json = clients.map(o => {
    const client = o.toJSON() as any
    return {
      id: client.person.id,
      fullName: client.person.fullName,
      phone: client.person.phone
    }
  })

  return json
};

export const getClientById = async (id: ID) => {
  const client = await findClientById({
    id,
    relation: true
  })

  return client;
};

export const createClient = async (data: any) => {
  if (!db || !db.sequelize) return;
  const t = await db.sequelize.transaction();

  try {
    const person = await createPerson(
      {
        fullName: data.fullName,
        email: data.email || null,
        phone: data.phone || null,
        cityId: data.cityId || null,
      },
      { transaction: t }
    );

    const createdClient = await Client.create(
      {
        personId: person.id,
        budget: data.budget || null,
      },
      { transaction: t }
    );

    const client = await findClientById({
      id: createdClient.personId,
      relation: true,
      transaction: t
    });

    await t.commit();

    return client;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const updateClient = async (id: ID, data: any) => {
  if (!db || !db.sequelize) return;
  const t = await db.sequelize.transaction();

  try {
    const client = await findClientById({
      id,
      transaction: t
    }) as Client

    await updatePerson(
      client.personId,
      {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        cityId: data.cityId,
      },
      { transaction: t }
    );

    if (data.budget !== undefined) {
      client.budget = data.budget;
      await client.save({ transaction: t });
    }

    const updatedClient = await findClientById({
      id: client.personId,
      relation: true,
      transaction: t
    });

    await t.commit();

    return updatedClient;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const deleteClientById = async (id: ID) => {
  await findClientById({ id })
  return await deletePersonById(id);
};

export const getClientFavorites = async (clientId: ID) => {
  await findClientById({ id: clientId });

  const favorites = await ClientFavorite.findAll({
    where: { clientId },
    include: [
      {
        model: Property,
        as: "property",
        attributes: ["id", "title", "backgroundUrl", "price"],
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name", "icon"],
          },
          {
            model: City,
            as: "city",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });

  return favorites.map((favorite: any) => ({
    id: favorite.property?.id,
    title: favorite.property?.title,
    backgroundUrl: favorite.property?.backgroundUrl,
    price: favorite.property?.price || 0,
    category: favorite.property?.category ?? null,
    city: favorite.property?.city ?? null,
  }));
};

export const getClientUnfavoriteProperties = async (clientId: ID) => {
  await findClientById({ id: clientId })

  const favorites = await ClientFavorite.findAll({
    where: { clientId },
    attributes: ["propertyId"],
    raw: true,
  });

  const favoritePropertyIds = favorites.map(
    (favorite) => favorite.propertyId,
  );

  const properties = await Property.findAll({
    where: favoritePropertyIds.length
      ? {
        id: {
          [Op.notIn]: favoritePropertyIds,
        },
      }
      : undefined,
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name", "icon"],
      },
      {
        model: City,
        as: "city",
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return properties.map((property) => property.toJSON());
};

export const addClientFavorite = async (clientId: ID, propertyId: ID) => {
  await findClientById({ id: clientId })
  await findPropertyById({ id: propertyId })

  const existingFavorite = await ClientFavorite.findOne({
    where: {
      clientId,
      propertyId,
    },
  });

  if (existingFavorite) {
    throw new ErrorHandler("Property is already in client's favorites", 400);
  }

  await ClientFavorite.create({
    clientId,
    propertyId,
  });

  const property = await Property.findByPk(propertyId, {
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name", "icon"],
      },
      {
        model: City,
        as: "city",
        attributes: ["id", "name"],
      },
    ],
    attributes: ["id", "title", "backgroundUrl", "price"],
  });

  if (!property)
    throw new ErrorHandler("Internal server error", 500)

  const data = property.toJSON() as any

  return {
    id: data.id,
    title: data.title,
    backgroundUrl: data.backgroundUrl,
    price: data.price || 0,
    category: data.category ?? null,
    city: data.city ?? null,
  };
};

export const removeClientFavorite = async (clientId: ID, propertyId: ID) => {
  await findClientById({ id: clientId })

  const favorite = await findClientFavoriteById({
    clientId,
    propertyId
  }) as ClientFavorite

  await favorite.destroy();

  return { id: propertyId };
};