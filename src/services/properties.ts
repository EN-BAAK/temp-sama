import { Op } from "sequelize";
import { Property } from "../modules/properties";
import { Category } from "../modules/categories";
import { City } from "../modules/cities";
import { PropertyCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";
import { findPropertyById, findPropertyImageById, findPropertyNoteById, findPropertyPlanById, formatResponse, handlePropertyFeatures, handlePropertyImages, handlePropertyPlans } from "../strategies/properties";
import { getAllPropertiesProps } from "../types/services";
import { safeUnlink } from "../utils/multer";
import ErrorHandler from "../middlewares/error";
import db from "../modules";
import { PropertyFeatureItemInput } from "../types/strategies";
import { PropertyNote } from "../modules/propertyNotes";
import { PropertyFeature } from "../modules/propertyFeatures";
import { PropertyImage } from "../modules/propertyImages";
import { findOwnerById } from "../strategies/owners";
import { Owner } from "../modules/owners";
import { PropertyPlan } from "../modules/proerptyPlans";
import { Person } from "../modules/persons";

export const getAllProperties = async ({ pa, l, ca, ci, map, mip, se: search, st, o, pu }: getAllPropertiesProps) => {
  const page = Number(pa) || 1;
  const limit = Number(l) || 10;
  const offsetUnit = Number(o) || 0
  const offset = (page - 1) * limit + offsetUnit;

  const whereClause: any = {};

  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (ci) whereClause.cityId = ci;
  if (ca) whereClause.categoryId = ca;
  if (st) whereClause.status = st;
  if (pu) whereClause.purpose = pu;

  if (mip || map) {
    whereClause.price = {};
    if (mip) whereClause.price[Op.gte] = Number(mip);
    if (map) whereClause.price[Op.lte] = Number(map);
  }

  const { count, rows } = await Property.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      { model: Category, as: "category", attributes: ["name"] },
      {
        model: City,
        as: "city",
        attributes: ["name"],
      },
      {
        model: Owner,
        as: "owner",
        attributes: [],
        include: [
          {
            model: Person,
            as: "person",
            attributes: ["fullName"]
          }
        ]
      },
    ],
  });

  const totalPages = Math.ceil(count / limit);

  return {
    items: rows.map((prop) => formatResponse(prop)),
    page,
    limit,
    total: count,
    totalPages,
    nextPage: page < totalPages ? page + 1 : false,
    prevPage: page > 1 ? page - 1 : false,
  };
};

export const getPropertiesIdentifiers = async () => {
  const properties = await Property.findAll({
    attributes: ["id", "title", "backgroundUrl"],
    order: [["createdAt", "DESC"]],
  });

  return properties.map((property) => property.toJSON());
};

export const getUnsignedPropertiesIdentifiers = async () => {
  const properties = await Property.findAll({
    where: { ownerId: null },
    attributes: ["id", "title", "backgroundUrl"],
    order: [["createdAt", "DESC"]],
  });

  return properties.map((property) => property.toJSON());
};

export const getPropertyById = async (id: ID) => {
  const property = await findPropertyById({ id, relation: true })
  return property;
};

export const getPropertySettingsById = async (propertyId: ID,) => {
  const property = await Property.findByPk(propertyId, {
    include: [
      {
        model: PropertyFeature,
        as: "features",
        attributes: ["id", "name"],
      },
      {
        model: PropertyImage,
        as: "images",
        attributes: ["id", "imageUrl"],
      },
      {
        model: PropertyPlan,
        as: "plans",
        attributes: ["id", "fileUrl", "extension"],
      },
    ],
  });

  if (!property) {
    throw new ErrorHandler("Property not found", 404);
  }
  const response = property.toJSONSettings() as any
  response.features = (response.features ?? []).map((feature: any) => ({
    id: feature.id,
    name: feature.name,
    state: "old" as const,
  }));

  return response
};

export const createProperty = async (
  data: PropertyCreationAttributes,
  backgroundFile?: Express.Multer.File,
  galleryFiles: Express.Multer.File[] = [],
  planFiles: Express.Multer.File[] = [],
  featuresInput?: string | PropertyFeatureItemInput[]
) => {
  if (!db?.sequelize) {
    throw new ErrorHandler("Internal Server Error", 500);
  }

  const transaction = await db.sequelize.transaction();

  const backgroundUrl = backgroundFile
    ? `uploads/properties/${backgroundFile.filename}`
    : null;

  const uploadedFilePaths = [
    ...(backgroundUrl ? [backgroundUrl] : []),
    ...galleryFiles.map(
      (file) => `uploads/properties/${file.filename}`
    ),
    ...planFiles.map(
      (file) => `uploads/properties/${file.filename}`
    ),
  ];

  try {
    const createdProperty = await Property.create(
      { ...data, backgroundUrl, },
      { transaction, }
    );

    if (galleryFiles && galleryFiles.length) {
      await handlePropertyImages(createdProperty.id, galleryFiles, transaction,);
    }
    if (planFiles && planFiles.length) {
      await handlePropertyPlans(createdProperty.id, planFiles, transaction);
    }
    if (featuresInput) {
      await handlePropertyFeatures(createdProperty, featuresInput, transaction);
    }

    const property = await findPropertyById({ id: createdProperty.id, transaction, relation: true, });

    await transaction.commit();

    return property;
  } catch (error) {
    await transaction.rollback();
    await Promise.allSettled(
      uploadedFilePaths.map((filePath) =>
        safeUnlink(filePath)
      )
    );

    throw error;
  }
};

export const updateProperty = async (
  id: ID,
  data: Partial<PropertyCreationAttributes> & { removeImage?: boolean },
  backgroundFile?: Express.Multer.File,
  galleryFiles?: Express.Multer.File[],
  planFiles?: Express.Multer.File[],
  featuresInput?: string | PropertyFeatureItemInput[]
) => {
  if (!db || !db.sequelize) throw new ErrorHandler("Database connection error", 500);

  const t = await db.sequelize.transaction();
  const updatedProperty = await Property.findByPk(id);

  if (!updatedProperty) {
    if (backgroundFile) safeUnlink(`uploads/properties/${backgroundFile.filename}`);
    galleryFiles?.forEach((file) => safeUnlink(`uploads/properties/${file.filename}`));
    planFiles?.forEach((file) => safeUnlink(`uploads/properties/${file.filename}`));
    throw new ErrorHandler("Property not found", 404);
  }

  const oldBackgroundUrl = updatedProperty.backgroundUrl;
  const newBackgroundUrl = backgroundFile ? `uploads/properties/${backgroundFile.filename}` : null;

  try {
    if (newBackgroundUrl) {
      updatedProperty.backgroundUrl = newBackgroundUrl;
    } else if (data.removeImage) {
      updatedProperty.backgroundUrl = null;
    }

    Object.assign(updatedProperty, data);
    await updatedProperty.save({ transaction: t });

    if (galleryFiles && galleryFiles.length) {
      await handlePropertyImages(updatedProperty.id, galleryFiles, t);
    }

    if (planFiles && planFiles.length) {
      await handlePropertyPlans(updatedProperty.id, planFiles, t);
    }

    if (featuresInput) {
      await handlePropertyFeatures(updatedProperty, featuresInput, t);
    }

    if (newBackgroundUrl || data.removeImage) {
      safeUnlink(oldBackgroundUrl);
    }

    const property = await findPropertyById({ id: updatedProperty.id, transaction: t, relation: true });
    await t.commit();
    return property
  } catch (err) {
    await t.rollback();
    safeUnlink(newBackgroundUrl);
    galleryFiles?.forEach((file) => safeUnlink(`uploads/properties/${file.filename}`));
    throw err;
  }
};

export const deletePropertyById = async (id: ID) => {
  if (!db?.sequelize) {
    throw new ErrorHandler("Database connection error", 500);
  }

  const transaction = await db.sequelize.transaction();

  let filesToDelete: string[] = [];

  try {
    const property = await findPropertyById({
      id,
      transaction,
    }) as Property;

    const images = await PropertyImage.findAll({
      where: {
        propertyId: property.id,
      },
      attributes: ["id", "imageUrl"],
      transaction,
    });

    const plans = await PropertyPlan.findAll({
      where: { propertyId: property.id },
      attributes: ["id", "fileUrl"],
      transaction,
    });

    filesToDelete = [
      ...(property.backgroundUrl ? [property.backgroundUrl] : []),
      ...images.map((image) => image.imageUrl),
      ...plans.map((plan) => plan.fileUrl)
    ];

    await property.destroy({ transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  const deleteResults = await Promise.allSettled(
    filesToDelete.map((filePath) => safeUnlink(filePath))
  );

  deleteResults.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `Failed to delete file: ${filesToDelete[index]}`,
        result.reason
      );
    }
  });

  return { id };
};

export const deletePropertyImageById = async (imageId: ID) => {
  const image = await findPropertyImageById({ id: imageId }) as PropertyImage
  await image.destroy();
  return { id: imageId };
};

export const getPropertyNotes = async (propertyId: ID) => {
  await findPropertyById({ id: propertyId })

  const notes = await PropertyNote.findAll({
    where: { propertyId },
    order: [["id", "DESC"]],
  });

  const safeNotes = notes.map(n => n.toJSON())
  return safeNotes;
};

export const getPropertyFeatures = async (propertyId: ID) => {
  const property = await Property.findByPk(propertyId, {
    attributes: ["id"],
    include: [
      {
        model: PropertyFeature,
        as: "features",
        attributes: ["id", "name"],
      },
    ],
  })

  if (!property) throw new ErrorHandler("Property not found", 404)

  const response = property.toJSON() as any
  const features = response.features || [];
  return features;
};

export const getPropertyImages = async (propertyId: ID) => {
  await findPropertyById({ id: propertyId })

  const images = await PropertyImage.findAll({ where: { propertyId } })

  const response = images.map(i => i.toJSON())
  return response;
};

export const getPropertyOwner = async (propertyId: ID) => {
  const property = await findPropertyById({ id: propertyId }) as Property
  if (!property.ownerId) throw new ErrorHandler("Owner not found", 404)

  const owner = await findOwnerById({ id: property.ownerId, relation: true })
  return owner;
};

export const createPropertyNote = async (propertyId: ID, noteText: string) => {
  await findPropertyById({ id: propertyId })

  const note = await PropertyNote.create({
    propertyId,
    note: noteText,
  });

  const safeNote = findPropertyNoteById({ id: note.id, isJson: true })
  return safeNote;
};

export const deletePropertyNoteById = async (noteId: ID) => {
  const note = await findPropertyNoteById({ id: noteId }) as PropertyNote
  await note.destroy();
  return { id: noteId };
};

export const getPropertyPlans = async (propertyId: ID) => {
  await findPropertyById({ id: propertyId });

  const plans = await PropertyPlan.findAll({ where: { propertyId } });
  return plans.map((p) => p.toJSON());
};

export const deletePropertyPlanById = async (planId: ID) => {
  const plan = await findPropertyPlanById({ id: planId }) as PropertyPlan;
  await plan.destroy();
  return { id: planId };
};