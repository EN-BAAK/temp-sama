import { Category } from "../modules/categories";
import { CategoryCreationAttributes } from "../types/modules";
import { ID } from "../types/variables";
import { findCategoryById } from "../strategies/categories";

export const getAllCategories = async () => {
  const categories = await Category.findAll({
    order: [["id", "DESC"]],
  });
  return categories.map((category) => category.toJSON());
};

export const getCategoryById = async (id: ID) => {
  const category = await findCategoryById({ id, isJson: true })
  return category;
};

export const createCategory = async (data: CategoryCreationAttributes) => {
  const createdCategory = await Category.create(data);
  return createdCategory.toJSON();
};

export const updateCategory = async (id: ID, data: Partial<CategoryCreationAttributes>) => {
  const updatedCategory = await findCategoryById({ id }) as Category

  Object.assign(updatedCategory, data);
  await updatedCategory.save();

  return updatedCategory.toJSON();
};

export const deleteCategoryById = async (id: ID) => {
  const category = await findCategoryById({ id }) as Category
  await category.destroy();
  return { id };
};