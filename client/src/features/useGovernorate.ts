import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CityEntity, GovernorateEntity } from "@/types/entities";
import { createCity, createGovernorate, deleteCity, deleteGovernorateById, getAllCities, getAllGovernorates, updateCity, updateGovernorate, } from "@/api-client";
import { ID } from "@/types/global";
import { APIResponse } from "@/libraries/react-query/types";
import { useAppContext } from "@/libraries/project-provider/AppProvider";
import { useRouter } from "next/navigation";

const governoratesBaseKey = "governorates";
const citiesBaseKey = "cities";

export const useGetAllGovernorates = () => {
  return useQuery({
    queryKey: [governoratesBaseKey],
    queryFn: getAllGovernorates,
    retry: false,
  });
};

export const useGetGovernorateById = (id: ID) => {
  const queryClient = useQueryClient();

  const rootCache = queryClient.getQueryData<APIResponse<GovernorateEntity[]>>([
    governoratesBaseKey,
  ]);

  if (!rootCache?.data) return null;

  return rootCache.data.find((gov) => gov.id === id) || null;
};

export const useCreateGovernorate = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { pushToast } = useAppContext();
  const rootQueryKey = [governoratesBaseKey];

  return useMutation({
    mutationFn: createGovernorate,
    onSuccess: (newGovResponse) => {
      const newGov = newGovResponse.data;

      queryClient.setQueryData<APIResponse<GovernorateEntity[]>>(
        rootQueryKey,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: [{ ...newGov, cities: newGov.cities || [] }, ...oldData.data],
          };
        }
      );

      pushToast({ message: "تم اضافة المحافظة بنجاح", type: "SUCCESS" });
      router.back();
    },
    onError: () => {
      pushToast({ message: "فشل اضافة المحافظة", type: "ERROR" });
    },
  });
};

export const useUpdateGovernorate = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();
  const router = useRouter()

  const rootQueryKey = [governoratesBaseKey];

  return useMutation({
    mutationFn: updateGovernorate,
    onSuccess: (updatedResponse) => {
      const updatedGov = updatedResponse.data;

      queryClient.setQueryData<APIResponse<GovernorateEntity[]>>(
        rootQueryKey,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === updatedGov.id
                ? { ...item, ...updatedGov, cities: item.cities }
                : item
            ),
          };
        }
      );

      pushToast({ message: "تم تعديل المحافظة بنجاح", type: "SUCCESS" });
      router.back();
    },
    onError: () => {
      pushToast({ message: "فشل تعديل المحافظة", type: "ERROR" });
    },
  });
};

export const useDeleteGovernorateById = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();
  const rootQueryKey = [governoratesBaseKey];

  return useMutation({
    mutationFn: deleteGovernorateById,
    onSuccess: (_, id) => {
      queryClient.setQueryData<APIResponse<GovernorateEntity[]>>(
        rootQueryKey,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter((item) => item.id !== id),
          };
        }
      );

      pushToast({ message: "تم حذف المحافظة بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل حذف المحافظة", type: "ERROR" });
    },
  });
};

export const useGetAllCities = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [citiesBaseKey],
    queryFn: getAllCities,
    retry: false,
    initialData: () => {
      const governoratesCache = queryClient.getQueryData<APIResponse<GovernorateEntity[]>>([
        governoratesBaseKey,
      ]);

      if (!governoratesCache?.data) return undefined;

      const allCitiesFromGovs = governoratesCache.data.flatMap(
        (gov) => gov.cities || []
      );

      return {
        ...governoratesCache,
        data: allCitiesFromGovs,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });
};

export const useCreateCity = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();
  const rootQueryKey = [governoratesBaseKey];

  return useMutation({
    mutationFn: createCity,
    onSuccess: (newCityResponse, { governorateId }) => {
      const newCity = newCityResponse.data;

      queryClient.setQueryData<APIResponse<GovernorateEntity[]>>(
        rootQueryKey,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((gov) =>
              gov.id === governorateId
                ? { ...gov, cities: [...(gov.cities || []), newCity] }
                : gov
            ),
          };
        }
      );

      queryClient.setQueryData<APIResponse<CityEntity[]>>(
        [citiesBaseKey],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: [...oldData.data, newCity],
          };
        }
      );

      pushToast({ message: "تم اضافة المدينة بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل اضافة المدينة", type: "ERROR" });
    },
  });
};

export const useUpdateCity = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();
  const rootQueryKey = [governoratesBaseKey];

  return useMutation({
    mutationFn: updateCity,
    onSuccess: (updatedCityResponse, { cityId, governorateId }) => {
      const updatedCity = updatedCityResponse.data;

      queryClient.setQueryData<APIResponse<GovernorateEntity[]>>(
        rootQueryKey,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((gov) =>
              gov.id === governorateId
                ? {
                  ...gov,
                  cities: (gov.cities || []).map((city) =>
                    city.id === cityId ? { ...city, ...updatedCity } : city
                  ),
                }
                : gov
            ),
          };
        }
      );

      queryClient.setQueryData<APIResponse<CityEntity[]>>(
        [citiesBaseKey],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((city) =>
              city.id === cityId ? { ...city, ...updatedCity } : city
            ),
          };
        }
      );

      pushToast({ message: "تم تعديل المدينة بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل تعديل المدينة", type: "ERROR" });
    },
  });
};

export const useDeleteCity = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();
  const rootQueryKey = [governoratesBaseKey];

  return useMutation({
    mutationFn: deleteCity,
    onSuccess: (_, { governorateId, cityId }) => {
      queryClient.setQueryData<APIResponse<GovernorateEntity[]>>(
        rootQueryKey,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((gov) =>
              gov.id === governorateId
                ? {
                  ...gov,
                  cities: (gov.cities || []).filter((city) => city.id !== cityId),
                }
                : gov
            ),
          };
        }
      );

      queryClient.setQueryData<APIResponse<CityEntity[]>>(
        [citiesBaseKey],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((city) => city.id !== cityId),
          };
        }
      );

      pushToast({ message: "تم حذف المدينة بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل حذف المدينة", type: "ERROR" });
    },
  });
};