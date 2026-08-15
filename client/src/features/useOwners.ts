import { assignPropertyToOwner, createOwner, deleteOwnerById, getAllOwnerProperties, getAllOwners, getAllOwnersIdentifiers, getOwnerById, unassignPropertyFromOwner, updateOwner } from "@/api-client";
import { useOffsetContext } from "@/libraries/offset/OffsetsProvider";
import { UpdateOffsetUnitProcess } from "@/libraries/offset/types";
import { useAppContext } from "@/libraries/project-provider/AppProvider";
import { APIResponse, PaginationResponse } from "@/libraries/react-query/types";
import { OwnerEntity, OwnerEntityIdentifier, OwnerPropertyEntity, PropertyIdentifiersEntity } from "@/types/entities";
import { ID } from "@/types/global";
import { EnableParams } from "@/types/queries";
import { keepPreviousData, QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { unsignedPropertiesBaseKey } from "./useProperties";
import { personNotesBaseKey } from "./usePersons";

const LIMIT = 9;

const ownersBaseKey = "owners";
const ownersIdentifiersBaseKey = "owners-identifiers"

const ownerBaseKey = "owner";
export const ownerPropertiesBaseKey = "owner-properties";

const OFFSET_KEY = [ownersBaseKey, LIMIT]

export const removeDerivedSearchCaches = (queryClient: QueryClient) => {
  queryClient.removeQueries({
    predicate: (query) => {
      const [baseKey, , , search] = query.queryKey;

      return (
        baseKey === ownersBaseKey &&
        typeof search === "string" &&
        search.trim() !== ""
      );
    },
  });
};

export const useGetAllOwners = (page: number, search: string = "") => {
  const queryKey = [ownersBaseKey, LIMIT, page, search];

  const { getOffsetUnit } = useOffsetContext();
  const offset = getOffsetUnit(OFFSET_KEY);

  return useQuery({
    queryKey,
    queryFn: () => getAllOwners({ limit: LIMIT, page, search, offset }),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetOwnersIdentifiers = ({ enable = true }: EnableParams) => {
  return useQuery({
    queryKey: [ownersIdentifiersBaseKey],
    queryFn: getAllOwnersIdentifiers,
    enabled: enable,
    retry: false,
  });
};

export const useGetOwnerProperties = (id: ID) => {
  return useQuery({
    queryKey: [ownerPropertiesBaseKey, id],
    queryFn: () => getAllOwnerProperties(id),
    retry: false,
  });
};

export const useGetOwnerById = (id: ID) => {
  return useQuery({
    queryKey: [ownerBaseKey, id],
    queryFn: () => getOwnerById(id),
    enabled: Boolean(id),
    retry: false,
  });
};

export const useCreateOwner = () => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext();
  const { pushToast } = useAppContext();
  const router = useRouter();

  return useMutation({
    mutationFn: createOwner,
    onSuccess: (newOwnerResponse) => {
      const newOwner = newOwnerResponse.data;

      queryClient.setQueriesData<PaginationResponse<OwnerEntity>>(
        {
          predicate: (query) => {
            const [baseKey, , page] = query.queryKey;
            return baseKey === ownersBaseKey && page === 1;
          },
        },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: [newOwner, ...oldData.data.items],
            },
          };
        }
      );

      queryClient.setQueryData<APIResponse<OwnerEntityIdentifier[]>>(
        [ownersIdentifiersBaseKey],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: [{ id: newOwner.id, fullName: newOwner.fullName }, ...old.data],
          };
        }
      );

      pushToast({ message: "تم إضافة المالك بنجاح", type: "SUCCESS" });
      updateOffsetUnit(OFFSET_KEY, UpdateOffsetUnitProcess.UP);
      removeDerivedSearchCaches(queryClient);
      router.back();
    },
    onError: () => {
      pushToast({ message: "فشل إضافة المالك", type: "ERROR" });
    },
  });
};

export const useUpdateOwner = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();
  const router = useRouter();

  const rootQueryKey = [ownersBaseKey];

  return useMutation({
    mutationFn: updateOwner,
    onSuccess: (updatedResponse, { id }) => {
      const updatedOwner = updatedResponse.data;

      queryClient.setQueriesData<PaginationResponse<OwnerEntity>>({ queryKey: rootQueryKey }, (oldData) => {
        if (!oldData?.data?.items) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: oldData.data.items.map((item) =>
              item.id === updatedOwner.id ? updatedOwner : item
            ),
          },
        };
      });

      queryClient.setQueryData<APIResponse<OwnerEntityIdentifier[]>>(
        [ownersIdentifiersBaseKey],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((item) =>
              item.id === id ? { id: updatedOwner.id, fullName: updatedOwner.fullName } : item
            ),
          };
        }
      );

      queryClient.setQueryData<APIResponse<OwnerEntity>>([ownerBaseKey, id],
        (old) => (old ? { ...old, data: { ...old.data, ...updatedOwner } } : old)
      );

      removeDerivedSearchCaches(queryClient);
      pushToast({ message: "تم تعديل المالك بنجاح", type: "SUCCESS" });
      router.back();
    },
    onError: () => {
      pushToast({ message: "فشل تعديل المالك", type: "ERROR" });
    },
  });
};

export const useAssignPropertyToOwner = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();

  return useMutation({
    mutationFn: assignPropertyToOwner,
    onSuccess: (res, { ownerId, propertyId }) => {
      const assignedProperty = res.data;

      queryClient.setQueriesData<APIResponse<OwnerPropertyEntity[]>>({ queryKey: [ownerPropertiesBaseKey, ownerId] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: [
              ...oldData.data,
              { ...assignedProperty }
            ],
          };
        }
      )

      queryClient.setQueriesData<APIResponse<PropertyIdentifiersEntity[]>>({ queryKey: [unsignedPropertiesBaseKey] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter(i => i.id !== propertyId),
          };
        }
      );

      pushToast({ message: "تم اضافة عقار للمالك بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل اضافة العقار للمالك", type: "ERROR" });
    },
  });
};

export const useDeleteOwnerById = () => {
  const { updateOffsetUnit } = useOffsetContext();
  const { pushToast } = useAppContext();
  const queryClient = useQueryClient();

  const rootQueryKey = [ownersBaseKey];

  return useMutation({
    mutationFn: deleteOwnerById,
    onSuccess: (_, id) => {
      queryClient.setQueriesData<PaginationResponse<OwnerEntity>>({ queryKey: rootQueryKey }, (oldData) => {
        if (!oldData?.data?.items) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: oldData.data.items.filter((item) => item.id !== id),
          },
        };
      });

      queryClient.setQueryData<APIResponse<OwnerEntityIdentifier[]>>(
        [ownersIdentifiersBaseKey],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((item) => item.id !== id),
          };
        }
      );

      updateOffsetUnit(OFFSET_KEY, UpdateOffsetUnitProcess.DOWN);
      queryClient.removeQueries({ queryKey: [ownerBaseKey, id], exact: true });
      queryClient.removeQueries({ queryKey: [ownerPropertiesBaseKey, id], exact: true });
      queryClient.removeQueries({ queryKey: [personNotesBaseKey, id], exact: true });
      removeDerivedSearchCaches(queryClient);

      pushToast({ message: "تم حذف المالك بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل حذف المالك", type: "ERROR" });
    },
  });
};

export const useUnassignPropertyFromOwner = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();

  return useMutation({
    mutationFn: unassignPropertyFromOwner,
    onSuccess: (res, { ownerId, propertyId }) => {
      const unassignedProperty = res.data;

      queryClient.setQueriesData<APIResponse<OwnerPropertyEntity[]>>({ queryKey: [ownerPropertiesBaseKey, ownerId] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter(i => i.id !== propertyId),
          };
        }
      )

      queryClient.setQueriesData<APIResponse<PropertyIdentifiersEntity[]>>({ queryKey: [unsignedPropertiesBaseKey] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: [
              ...oldData.data,
              { id: unassignedProperty.id, backgroundUrl: unassignedProperty.backgroundUrl, title: unassignedProperty.title }
            ],
          };
        }
      );

      pushToast({ message: "تم حذف العقار من المالك بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل حذف العقار من المالك", type: "ERROR" });
    },
  });
};