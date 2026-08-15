import { Governorate } from "../modules/governorates";
import { City } from "../modules/cities";
import { GovernorateCreationAttributes, CityCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";
import ErrorHandler from "../middlewares/error";
import { findCityById, findGovernorateById } from "../strategies/governorates";

export const getAllGovernorates = async () => {
  const governorates = await Governorate.findAll({
    include: [
      {
        model: City,
        as: "cities",
        attributes: ["id", "name"],
      },
    ],
  });
  return governorates.map((gov) => gov.toJSON());
};

export const getGovernorateById = async (id: ID) => {
  const governorate = await findGovernorateById({ id, relation: true })
  return governorate;
};

export const createGovernorate = async (data: GovernorateCreationAttributes) => {
  const createdGovernorate = await Governorate.create(data);
  const governorate = await findGovernorateById({ id: createdGovernorate.id, relation: true })

  return governorate;
};

export const updateGovernorate = async (id: ID, data: Partial<GovernorateCreationAttributes>) => {
  const governorate = await findGovernorateById({ id }) as Governorate

  Object.assign(governorate, data);
  await governorate.save();

  return governorate.toJSON();
};

export const deleteGovernorateById = async (id: ID) => {
  const governorate = await findGovernorateById({ id }) as Governorate

  const citiesCount = await City.count({ where: { governorateId: id } });
  if (citiesCount > 0) {
    throw new ErrorHandler("Cannot delete governorate because it has linked cities", 400);
  }

  await governorate.destroy();
  return { id };
};

export const getAllCities = async () => {
  const cities = await City.findAll({
    attributes: ["id", "name"],
  });

  return cities.map((c) => c.toJSON());
};

export const createCity = async (data: CityCreationAttributes) => {
  await findGovernorateById({ id: data.governorateId })
  const createdCity = await City.create(data);

  const city = await findCityById({ id: createdCity.id, isJson: true })
  return city;
};

export const updateCityName = async (id: ID, name: string) => {
  const updatedCity = await findCityById({ id }) as City

  updatedCity.name = name;
  await updatedCity.save();

  const city = await findCityById({ id: updatedCity.id, isJson: true })
  return city;
};

export const deleteCityById = async (id: ID) => {
  const city = await findCityById({ id }) as City
  await city.destroy();
  return { id };
};