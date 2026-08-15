import path from "path";
import ErrorHandler from "../middlewares/error";
import { Category } from "../modules/categories";
import { City } from "../modules/cities";
import { PropertyFeature } from "../modules/propertyFeatures";
import { Owner } from "../modules/owners";
import { PropertyPlan } from "../modules/proerptyPlans";
import { Property } from "../modules/properties";
import { PropertyImage } from "../modules/propertyImages";
import { PropertyNote } from "../modules/propertyNotes";
import { findPropertyByIdProps, findPropertyImageByIdProps, findPropertyNoteByIdProps, FindPropertyPlanByIdProps, PropertyFeatureItemInput } from "../types/strategies";
import { ID } from "../types/variables";
import { Person } from "../modules/persons";

export const formatResponse = (property: Property,) => {
  const data = property.toJSON() as any;

  return {
    ...data,
    city: data.city?.name,
    category: data.category?.name || "",
    price: Number(data.price),
    owner: data.owner?.person?.fullName
  }
};

export const findPropertyById = async ({ id, relation = false, transaction }: findPropertyByIdProps) => {
  const includes = relation ? [
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
  ] : undefined

  const property = await Property.findByPk(id, {
    include: includes,
    transaction
  });

  if (!property) {
    throw new ErrorHandler("Property not found", 404);
  }

  return relation ? formatResponse(property) : property;
}

export const findPropertyNoteById = async ({ id, isJson = false, transaction }: findPropertyNoteByIdProps) => {
  const note = await PropertyNote.findByPk(id, {
    transaction
  });

  if (!note) {
    throw new ErrorHandler("Note not found", 404);
  }

  return isJson ? note?.toJSON() : note;
}

export const findPropertyImageById = async ({ id, isJson = false, transaction }: findPropertyImageByIdProps) => {
  const image = await PropertyImage.findByPk(id, {
    transaction
  });

  if (!image) {
    throw new ErrorHandler("Image not found", 404);
  }

  return isJson ? image?.toJSON() : image;
}

export const handlePropertyImages = async (
  propertyId: ID,
  files?: Express.Multer.File[],
  transaction?: any
) => {
  if (!files || files.length === 0) return;

  for (const file of files) {
    const imageUrl = `uploads/properties/${file.filename}`;
    await PropertyImage.create(
      { propertyId, imageUrl },
      { transaction }
    );
  }
};

export const handlePropertyFeatures = async (
  property: Property,
  featuresInput?: string | PropertyFeatureItemInput[],
  transaction?: any
) => {
  if (!featuresInput) return;

  const parsedItems: PropertyFeatureItemInput[] =
    typeof featuresInput === "string" ? JSON.parse(featuresInput) : featuresInput;

  for (const item of parsedItems) {
    switch (item.state) {
      case "new": {
        if (item.id) {
          await (property as any).addFeature(item.id, { transaction });
        }
        break;
      }

      case "created": {
        if (item.name) {
          const [feature] = await PropertyFeature.findOrCreate({
            where: { name: item.name },
            defaults: { name: item.name, color: item.color || null },
            transaction,
          });
          await (property as any).addFeature(feature.id, { transaction });
        }
        break;
      }

      case "remove": {
        if (item.id) {
          await (property as any).removeFeature(item.id, { transaction });
        }
        break;
      }

      case "old":
        break;
    }
  }
};

export const findPropertyPlanById = async ({ id, isJson = false, transaction, }: FindPropertyPlanByIdProps) => {
  const plan = await PropertyPlan.findByPk(id, { transaction });

  if (!plan) {
    throw new ErrorHandler("Property plan not found", 404);
  }

  return isJson ? plan.toJSON() : plan;
};

export const handlePropertyPlans = async (
  propertyId: ID,
  files?: Express.Multer.File[],
  transaction?: any
) => {
  if (!files || files.length === 0) return;

  for (const file of files) {
    const fileUrl = `uploads/properties/${file.filename}`;
    const extension = path.extname(file.originalname).replace(".", "").toLowerCase();

    await PropertyPlan.create(
      { propertyId, fileUrl, extension },
      { transaction }
    );
  }
};