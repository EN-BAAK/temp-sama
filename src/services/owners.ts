import { Op } from "sequelize";
import db from "../modules";
import { Owner } from "../modules/owners";
import { Person } from "../modules/persons";
import { ID } from "../types/variables";
import { getAllOwnersProps } from "../types/services";
import { findOwnerById, formatOwnerResponse } from "../strategies/owners";
import { createPerson, updatePerson, deletePersonById } from "./persons";
import { City } from "../modules/cities";
import { findPropertyById } from "../strategies/properties";
import ErrorHandler from "../middlewares/error";
import { Property } from "../modules/properties";
import { Category } from "../modules/categories";

export const getAllOwners = async (query: getAllOwnersProps) => {
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

  const { count, rows } = await Owner.findAndCountAll({
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
    items: rows.map((owner) => formatOwnerResponse(owner)),
    page,
    limit,
    total: count,
    totalPages,
    nextPage: page < totalPages ? page + 1 : false,
    prevPage: page > 1 ? page - 1 : false,
  };
};

export const getOwnerById = async (id: ID) => {
  const owner = await findOwnerById({
    id,
    relation: true
  })

  return owner;
};

export const getAllOwnersIdentifiers = async () => {
  const owners = await Owner.findAll({
    attributes: [],
    include: {
      model: Person,
      as: "person",
      attributes: ["id", "fullName", "phone"]
    }
  })

  const json = owners.map(o => {
    const owner = o.toJSON() as any
    return {
      id: owner.person.id,
      fullName: owner.person.fullName,
      phone: owner.person.phone
    }
  })

  return json
};

export const createOwner = async (data: any) => {
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

    const createdOwner = await Owner.create(
      {
        personId: person.id,
      },
      { transaction: t }
    );

    const owner = await findOwnerById({
      id: createdOwner.personId,
      relation: true,
      transaction: t
    });

    await t.commit();

    return owner;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const updateOwner = async (id: ID, data: any) => {
  if (!db || !db.sequelize) return;
  const t = await db.sequelize.transaction();

  try {
    const owner = await findOwnerById({
      id,
      transaction: t
    }) as Owner

    await updatePerson(
      owner.personId,
      {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        cityId: data.cityId,
      },
      { transaction: t }
    );

    const updatedOwner = await findOwnerById({
      id: owner.personId,
      relation: true,
      transaction: t
    });

    await t.commit();

    return updatedOwner;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const deleteOwnerById = async (id: ID) => {
  await findOwnerById({ id })
  return await deletePersonById(id);
};

export const getAllOwnerProperties = async (ownerId: ID) => {
  await findOwnerById({ id: ownerId })

  const data = await Property.findAll({
    where: { ownerId },
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
    attributes: ["id", "title", "backgroundUrl", "price",],
    order: [["createdAt", "DESC"]],
  });

  const properties = data.map(d => d.toJSON())

  return properties
};

export const assignPropertyToOwner = async (ownerId: ID, propertyId: ID) => {
  const owner = await findOwnerById({ id: ownerId }) as Owner
  const property = await findPropertyById({ id: propertyId }) as Property

  if (property.ownerId) throw new ErrorHandler("You can not assign to assigned property", 400);

  property.ownerId = owner.personId
  await property.save()

  const data = await Property.findByPk(propertyId, {
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
    attributes: ["id", "title", "backgroundUrl", "price",],
    order: [["createdAt", "DESC"]],
  })! as Property;

  const result = data.toJSON()

  return result;
};

export const unassignPropertyFromOwner = async (ownerId: ID, propertyId: ID) => {
  await findOwnerById({ id: ownerId }) as Owner
  const property = await findPropertyById({ id: propertyId }) as Property

  if (property.ownerId !== ownerId) throw new ErrorHandler("Internal server error", 500);

  property.ownerId = null
  await property.save()

  const properties = await Property.findAll({
    where: { ownerId: null },
    attributes: ["id", "title", "backgroundUrl"],
    order: [["createdAt", "DESC"]],
  });

  return properties.map((property) => property.toJSON());
};