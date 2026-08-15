import { keepPreviousData, QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OwnerPropertyEntity, PropertyEntity, PropertyIdentifiersEntity, PropertyImageEntity, PropertyNoteEntity, PropertyPlanEntity, } from "@/types/entities";
import { ID } from "@/types/global";
import { APIResponse, PaginationResponse } from "@/libraries/react-query/types";
import { useOffsetContext } from "@/libraries/offset/OffsetsProvider";
import { UpdateOffsetUnitProcess } from "@/libraries/offset/types";
import { useAppContext } from "@/libraries/project-provider/AppProvider";
import { useRouter } from "next/navigation";
import { GetPropertiesFilterParams } from "@/types/queries";
import { createProperty, createPropertyNote, deletePropertyById, deletePropertyImage, deletePropertyNote, deletePropertyPlans, getAllProperties, getPropertyById, getPropertysFeatures, getPropertyIdentifiers, getPropertyImages, getPropertyNotes, getPropertyOwner, getPropertyPlans, getPropertySettingsById, getUnsignedPropertyIdentifiers, updateProperty } from "@/api-client";
import { ownerPropertiesBaseKey } from "./useOwners";

const LIMIT = 9;

const propertiesBaseKey = "properties";
const propertyBaseKey = "property";
const propertyNotesBaseKey = "property-notes";
const propertyFeaturesBaseKey = "property-features";
const propertyOwnerBaseKey = "property-owner";
const propertyImagesBaseKey = "property-images";
const propertyPlansBaseKey = "property-plans";
const PropertyIdentifiersBaseKey = "property-identifiers"

export const unsignedPropertiesBaseKey = "property-unsigned"

export type PropertyStatus = string;
export type PropertyDuration = string;
export type PropertyPurpose = string;

const OFFSET_KEY = [propertiesBaseKey, LIMIT]

export const removeDerivedSearchAndFilterCaches = (queryClient: QueryClient) => {
  queryClient.removeQueries({
    predicate: (query) => {
      const [baseKey, , , search, filters] = query.queryKey as [
        string,
        number,
        number,
        string | undefined,
        GetPropertiesFilterParams | undefined
      ];

      const hasSearch = typeof search === "string" && search.trim() !== "";
      const hasFilters =
        filters &&
        Object.values(filters).some((val) => val !== undefined && val !== "");

      return baseKey === propertiesBaseKey && Boolean(hasSearch || hasFilters);
    },
  });
};

export const useGetAllProperties = (
  page: number,
  search: string = "",
  filters: GetPropertiesFilterParams = {}
) => {
  const queryKey = [propertiesBaseKey, LIMIT, page, search, filters];

  const { getOffsetUnit } = useOffsetContext();
  const offset = getOffsetUnit(OFFSET_KEY);

  return useQuery({
    queryKey,
    queryFn: () => getAllProperties({ limit: LIMIT, page, search, offset, ...filters }),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetPropertyById = (id: ID) => {
  return useQuery({
    queryKey: [propertyBaseKey, id],
    queryFn: () => getPropertyById(id),
    enabled: Boolean(id),
    retry: false,
  });
};

export const useGetPropertyIdentifiers = () => {
  return useQuery({
    queryKey: [PropertyIdentifiersBaseKey],
    queryFn: getPropertyIdentifiers,
    retry: false,
  });
};

export const useGetUnsignedPropertyIdentifiers = () => {
  return useQuery({
    queryKey: [unsignedPropertiesBaseKey],
    queryFn: getUnsignedPropertyIdentifiers,
    retry: false,
  });
};

export const useGetPropertySettingsById = (id: ID) => {
  return useQuery({
    queryKey: [propertyBaseKey, "settings", id],
    queryFn: () => getPropertySettingsById(id),
    enabled: Boolean(id),
    retry: false,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext();
  const { pushToast } = useAppContext();
  const router = useRouter();

  return useMutation({
    mutationFn: createProperty,
    onSuccess: (newPropertyResponse, payload) => {
      const newProperty = newPropertyResponse.data;

      queryClient.setQueriesData<PaginationResponse<PropertyEntity>>(
        {
          predicate: (query) => {
            const [baseKey, , page] = query.queryKey;
            return baseKey === propertiesBaseKey && page === 1;
          },
        },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: [newProperty, ...oldData.data.items],
            },
          };
        }
      );

      queryClient.setQueriesData<APIResponse<PropertyIdentifiersEntity[]>>({ queryKey: [PropertyIdentifiersBaseKey] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: [
              ...oldData.data,
              { id: newProperty.id, title: newProperty.title, backgroundUrl: newProperty.backgroundUrl }
            ],
          };
        }
      );

      if (newProperty.owner && payload.get("ownerId"))
        queryClient.setQueriesData<APIResponse<OwnerPropertyEntity[]>>({ queryKey: [ownerPropertiesBaseKey, payload.get("ownerId")] },
          (oldData) => {
            if (!oldData || !oldData.data) return oldData;

            return {
              ...oldData,
              data: [
                ...oldData.data,
                { id: newProperty.id, title: newProperty.title, backgroundUrl: newProperty.backgroundUrl }
              ],
            };
          }
        )

      else
        queryClient.setQueriesData<APIResponse<PropertyIdentifiersEntity[]>>({ queryKey: [unsignedPropertiesBaseKey] },
          (oldData) => {
            if (!oldData || !oldData.data) return oldData;

            return {
              ...oldData,
              data: [
                ...oldData.data,
                { id: newProperty.id, title: newProperty.title, backgroundUrl: newProperty.backgroundUrl }
              ],
            };
          }
        );

      pushToast({ message: "تم إضافة العقار بنجاح", type: "SUCCESS" });
      updateOffsetUnit(OFFSET_KEY, UpdateOffsetUnitProcess.UP);
      removeDerivedSearchAndFilterCaches(queryClient);
      router.back();
    },
    onError: () => {
      pushToast({ message: "فشل إضافة العقار", type: "ERROR" });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();
  const router = useRouter();

  const rootQueryKey = [propertiesBaseKey];

  return useMutation({
    mutationFn: updateProperty,
    onSuccess: (updatedResponse, { id }) => {
      const updatedProperty = updatedResponse.data;

      queryClient.setQueriesData<PaginationResponse<PropertyEntity>>(
        { queryKey: rootQueryKey },
        (oldData) => {
          if (!oldData?.data?.items) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((item) =>
                item.id === updatedProperty.id ? updatedProperty : item
              ),
            },
          };
        }
      );

      queryClient.setQueriesData<APIResponse<PropertyIdentifiersEntity[]>>({ queryKey: [PropertyIdentifiersBaseKey] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map(i => i.id === id ? { id: updatedProperty.id, title: updatedProperty.title, backgroundUrl: updatedProperty.backgroundUrl } : i),
          };
        }
      );

      queryClient.setQueriesData<APIResponse<PropertyIdentifiersEntity[]>>({ queryKey: [unsignedPropertiesBaseKey] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map(i => i.id === id ? { ...i, id: updatedProperty.id, title: updatedProperty.title, backgroundUrl: updatedProperty.backgroundUrl } : i),
          };
        }
      );

      queryClient.setQueryData<APIResponse<PropertyEntity>>(
        [propertyBaseKey, id],
        (old) => (old ? { ...old, data: { ...old.data, ...updatedProperty } } : old)
      );

      queryClient.removeQueries({ queryKey: [propertyBaseKey, "settings", id], exact: true });

      removeDerivedSearchAndFilterCaches(queryClient);
      pushToast({ message: "تم تعديل العقار بنجاح", type: "SUCCESS" });
      router.back();
    },
    onError: () => {
      pushToast({ message: "فشل تعديل العقار", type: "ERROR" });
    },
  });
};

export const useDeletePropertyById = () => {
  const { updateOffsetUnit } = useOffsetContext();
  const { pushToast } = useAppContext();
  const queryClient = useQueryClient();

  const rootQueryKey = [propertiesBaseKey];

  return useMutation({
    mutationFn: deletePropertyById,
    onSuccess: (_, id) => {
      queryClient.setQueriesData<PaginationResponse<PropertyEntity>>(
        { queryKey: rootQueryKey },
        (oldData) => {
          if (!oldData?.data?.items) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.filter((item) => item.id !== id),
            },
          };
        }
      );

      queryClient.setQueriesData<APIResponse<PropertyIdentifiersEntity[]>>({ queryKey: [PropertyIdentifiersBaseKey] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter((p) => p.id !== id),
          };
        }
      );

      queryClient.setQueriesData<APIResponse<PropertyIdentifiersEntity[]>>({ queryKey: [unsignedPropertiesBaseKey] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter(i => i.id !== id),
          };
        }
      );

      updateOffsetUnit(OFFSET_KEY, UpdateOffsetUnitProcess.DOWN);
      queryClient.removeQueries({ queryKey: [propertyBaseKey, id], exact: true });
      queryClient.removeQueries({ queryKey: [propertyImagesBaseKey, id], exact: true });
      queryClient.removeQueries({ queryKey: [propertyPlansBaseKey, id], exact: true });
      queryClient.removeQueries({ queryKey: [propertyBaseKey, "settings", id], exact: true });
      queryClient.removeQueries({ queryKey: [ownerPropertiesBaseKey] });
      removeDerivedSearchAndFilterCaches(queryClient);

      pushToast({ message: "تم حذف العقار بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل حذف العقار", type: "ERROR" });
    },
  });
};

export const useGetPropertyNotes = (propertyId: ID) => {
  return useQuery({
    queryKey: [propertyNotesBaseKey, propertyId],
    queryFn: () => getPropertyNotes(propertyId),
    enabled: Boolean(propertyId),
    retry: false,
  });
};

export const useGetPropertyOwner = (propertyId: ID) => {
  return useQuery({
    queryKey: [propertyOwnerBaseKey, propertyId],
    queryFn: () => getPropertyOwner(propertyId),
    enabled: Boolean(propertyId),
    retry: false,
  });
};

export const useCreatePropertyNote = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();

  return useMutation({
    mutationFn: createPropertyNote,
    onSuccess: (newNoteResponse, { propertyId }) => {
      const newNote = newNoteResponse.data;

      queryClient.setQueryData<APIResponse<PropertyNoteEntity[]>>(
        [propertyNotesBaseKey, propertyId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: [newNote, ...old.data],
          };
        }
      );
      pushToast({ message: "تم إضافة الملاحظة بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل إضافة الملاحظة", type: "ERROR" });
    },
  });
};

export const useDeletePropertyNote = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();

  return useMutation({
    mutationFn: deletePropertyNote,
    onSuccess: (_, { propertyId, noteId }) => {
      queryClient.setQueryData<APIResponse<PropertyNoteEntity[]>>(
        [propertyNotesBaseKey, propertyId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((note) => note.id !== noteId),
          };
        }
      );

      pushToast({ message: "تم حذف الملاحظة بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل حذف الملاحظة", type: "ERROR" });
    },
  });
};

export const useGetPropertyFeatures = (propertyId: ID) => {
  return useQuery({
    queryKey: [propertyFeaturesBaseKey, propertyId],
    queryFn: () => getPropertysFeatures(propertyId),
    enabled: Boolean(propertyId),
    retry: false,
  });
};

export const useGetPropertyImages = (propertyId: ID) => {
  return useQuery({
    queryKey: [propertyImagesBaseKey, propertyId],
    queryFn: () => getPropertyImages(propertyId),
    enabled: Boolean(propertyId),
    retry: false,
  });
};

export const useGetPropertyPlans = (propertyId: ID) => {
  return useQuery({
    queryKey: [propertyPlansBaseKey, propertyId],
    queryFn: () => getPropertyPlans(propertyId),
    enabled: Boolean(propertyId),
    retry: false,
  });
};

export const useDeletePropertyImage = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();

  return useMutation({
    mutationFn: deletePropertyImage,
    onSuccess: (_, { propertyId, imageId }) => {
      queryClient.setQueryData<APIResponse<PropertyImageEntity[]>>(
        [propertyImagesBaseKey, propertyId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((img) => img.id !== imageId),
          };
        }
      );

      pushToast({ message: "تم حذف الصورة بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل حذف الصورة", type: "ERROR" });
    },
  });
};

export const useDeletePropertyPlan = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();

  return useMutation({
    mutationFn: deletePropertyPlans,
    onSuccess: (_, { propertyId, planId }) => {
      queryClient.setQueryData<APIResponse<PropertyPlanEntity[]>>(
        [propertyPlansBaseKey, propertyId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((plan) => plan.id !== planId),
          };
        }
      );

      pushToast({ message: "تم حذف المخطط بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل حذف المخطط", type: "ERROR" });
    },
  });
};
