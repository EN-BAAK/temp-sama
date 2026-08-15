import { PropertyFeature } from "../modules/propertyFeatures";

export const getAllPropertyFeatures = async () => {
  const features = await PropertyFeature.findAll({
    attributes: ["id", "name", "color"],
    order: [["id", "DESC"]],
  });

  return features.map((f) => f.toJSON());
};
