import { getPropertyFeatures } from "@/api-client";
import { useQuery } from "@tanstack/react-query";

const propertyFeaturesBaseKey = "employees";

export const useGetAllPropertyFeatures = () => {
  return useQuery({
    queryKey: [propertyFeaturesBaseKey],
    queryFn: getPropertyFeatures,
    retry: false,
  });
};