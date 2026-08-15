import ErrorHandler from "../middlewares/error";
import { Category } from "../modules/categories";
import { findCategoryByIdProps } from "../types/strategies";

export const findCategoryById = async ({ id, isJson = false, transaction }: findCategoryByIdProps) => {
  const category = await Category.findByPk(id, { transaction });
  if (!category) {
    throw new ErrorHandler("Category not found", 404);
  }

  return isJson ? category.toJSON() : category;
}