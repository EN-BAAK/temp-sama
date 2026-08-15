import ErrorHandler from "../middlewares/error";
import { City } from "../modules/cities";
import { Governorate } from "../modules/governorates";
import { findCityByIdProps, findGovernorateByIdProps } from "../types/strategies";

export const findGovernorateById = async ({ id, transaction, relation = false }: findGovernorateByIdProps) => {
  const includes = relation ?
    [
      {
        model: City,
        as: "cities",
        attributes: ["id", "name"],
      },
    ] : undefined

  const gov = await Governorate.findByPk(id, {
    include: includes,
    transaction
  });

  if (!gov) {
    throw new ErrorHandler("Governorate not found", 404);
  }

  return relation ? gov?.toJSON() : gov;
}

export const findCityById = async ({ id, isJson = false, transaction }: findCityByIdProps) => {
  const city = await City.findByPk(id, {
    transaction
  });

  if (!city) {
    throw new ErrorHandler("City note not found", 404);
  }

  return isJson ? city?.toJSON() : city;
}