import { keepPreviousData, QueryClient, useMutation, useQuery, useQueryClient, } from "@tanstack/react-query";
import { ClientEntity, ClientEntityCreation, ClientEntityIdentifier, FavoritePropertyEntity } from "@/types/entities";
import { createClient, createClientFavorite, deleteClientById, deleteClientFavorite, getAllClients, getAllClientsIdentifiers, getClientById, getClientFavoritesPropertiesById, updateClient, } from "@/api-client";
import { ID } from "@/types/global";
import { APIResponse, PaginationResponse } from "@/libraries/react-query/types";
import { useOffsetContext } from "@/libraries/offset/OffsetsProvider";
import { UpdateOffsetUnitProcess } from "@/libraries/offset/types";
import { useAppContext } from "@/libraries/project-provider/AppProvider";
import { useRouter } from "next/navigation";
import { CreateClientFavoriteParams, EnableParams } from "@/types/queries";
import { personNotesBaseKey } from "./usePersons";

const LIMIT = 9

const clientsBaseKey = "clients";
const clientBaseKey = "client"
const ClientIdentifiersBaseKey = "clients-identifiers"

const clientPropertiesBaseKey = "client-properties"
const favoritesBaseKey = "favorites"

const OFFSET_KEY = [clientsBaseKey, LIMIT]

export const removeDerivedSearchCaches = (queryClient: QueryClient) => {
  queryClient.removeQueries({
    predicate: (query) => {
      const [baseKey, , , search] = query.queryKey;

      return (
        baseKey === clientsBaseKey &&
        typeof search === "string" &&
        search.trim() !== ""
      );
    },
  });
};

export const useGetAllClients = (page: number, search: string = "") => {
  const queryKey = [clientsBaseKey, LIMIT, page, search]

  const { getOffsetUnit } = useOffsetContext();
  const offset = getOffsetUnit(OFFSET_KEY);

  return useQuery({
    queryKey: queryKey,
    queryFn: () => getAllClients({ limit: LIMIT, page, search, offset }),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetClientsIdentifiers = ({ enable = true }: EnableParams) => {
  return useQuery({
    queryKey: [ClientIdentifiersBaseKey],
    queryFn: getAllClientsIdentifiers,
    enabled: enable,
    retry: false,
  });
};


export const useGetClientById = (id: ID) => {
  return useQuery({
    queryKey: [clientBaseKey, id],
    queryFn: () => getClientById(id),
    enabled: Boolean(id),
    retry: false,
  });
};

export const useGetClientFavoritesById = (id: ID) => {
  return useQuery({
    queryKey: [clientPropertiesBaseKey, favoritesBaseKey, id],
    queryFn: () => getClientFavoritesPropertiesById(id),
    enabled: Boolean(id),
    retry: false,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext();
  const { pushToast } = useAppContext();
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: ClientEntityCreation) => createClient(payload),
    onSuccess: (newClientResponse) => {
      const newClient = newClientResponse.data;

      queryClient.setQueriesData<PaginationResponse<ClientEntity>>(
        {
          predicate: (query) => {
            const [baseKey, , page] = query.queryKey;
            return baseKey === clientsBaseKey && page === 1;
          },
        },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: [newClient, ...oldData.data.items],
            },
          };
        }
      );

      queryClient.setQueryData<APIResponse<ClientEntityIdentifier[]>>(
        [ClientIdentifiersBaseKey],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: [{ id: newClient.id, fullName: newClient.fullName, phone: newClient.phone }, ...old.data],
          };
        }
      );

      pushToast({ message: "تم اضافة العميل بنجاح", type: "SUCCESS" });
      updateOffsetUnit(OFFSET_KEY, UpdateOffsetUnitProcess.UP);
      removeDerivedSearchCaches(queryClient);
      router.back()
    }, onError: () => {
      pushToast({ message: "فشل اضافة العميل", type: "ERROR" });
    },
  });
};

export const useCreateClientFavorite = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();

  return useMutation({
    mutationFn: (payload: CreateClientFavoriteParams) => createClientFavorite(payload),
    onSuccess: (newClientResponse, payload) => {
      const newFav = newClientResponse.data;

      queryClient.setQueriesData<APIResponse<FavoritePropertyEntity[]>>({ queryKey: [clientPropertiesBaseKey, favoritesBaseKey, payload.clientId] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: [
              ...oldData.data,
              newFav
            ],
          };
        }
      );

      pushToast({ message: "تم اضافة العقار بنجاح", type: "SUCCESS" });
    }, onError: () => {
      pushToast({ message: "فشل اضافة العميل", type: "ERROR" });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();
  const router = useRouter()

  const rootQueryKey = [clientsBaseKey];

  return useMutation({
    mutationFn: updateClient,
    onSuccess: (updatedResponse, { id }) => {
      const updatedClient = updatedResponse.data;

      queryClient.setQueriesData<PaginationResponse<ClientEntity>>({ queryKey: rootQueryKey }, (oldData) => {
        if (!oldData?.data?.items) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: oldData.data.items.map((item) =>
              item.id === updatedClient.id ? updatedClient : item
            ),
          },
        };
      }
      );

      queryClient.setQueryData<APIResponse<ClientEntity>>([clientBaseKey, id],
        (old) => (old ? { ...old, data: { ...old.data, ...updatedClient } } : old)
      );

      queryClient.setQueryData<APIResponse<ClientEntityIdentifier[]>>(
        [ClientIdentifiersBaseKey],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((item) =>
              item.id === id ? { id: updatedClient.id, fullName: updatedClient.fullName, phone: updatedClient.phone } : item
            ),
          };
        }
      );

      removeDerivedSearchCaches(queryClient)
      pushToast({ message: "تم تعديل العميل بنجاح", type: "SUCCESS" });
      router.back()
    },
    onError: () => {
      pushToast({ message: "فشل تعديل العميل", type: "ERROR" });
    },
  });
};

export const useDeleteClientById = () => {
  const { updateOffsetUnit } = useOffsetContext();
  const { pushToast } = useAppContext();
  const queryClient = useQueryClient();

  const rootQueryKey = [clientsBaseKey];

  return useMutation({
    mutationFn: deleteClientById,
    onSuccess: (_, id) => {
      queryClient.setQueriesData<PaginationResponse<ClientEntity>>({ queryKey: rootQueryKey }, (oldData) => {
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

      queryClient.setQueryData<APIResponse<ClientEntityIdentifier[]>>(
        [ClientIdentifiersBaseKey],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((item) => item.id !== id),
          };
        }
      );

      updateOffsetUnit(OFFSET_KEY, UpdateOffsetUnitProcess.DOWN);
      queryClient.removeQueries({ queryKey: [clientBaseKey, id], exact: true, });
      queryClient.removeQueries({ queryKey: [personNotesBaseKey, id], exact: true, });
      queryClient.removeQueries({ queryKey: [clientPropertiesBaseKey, favoritesBaseKey, id], exact: true, });
      removeDerivedSearchCaches(queryClient);

      pushToast({ message: "تم حذف العميل بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل حذف العميل", type: "ERROR" });
    },
  });
};

export const useDeleteClientFavorites = () => {
  const { pushToast } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClientFavorite,
    onSuccess: (_, { propertyId, clientId }) => {
      queryClient.setQueriesData<APIResponse<FavoritePropertyEntity[]>>({ queryKey: [clientPropertiesBaseKey, favoritesBaseKey, clientId] }, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: [
            ...oldData.data.filter((item) => item.id !== propertyId),
          ],
        };
      }
      );

      pushToast({ message: "تم حذف العقار من قائمة المفضلة بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل حذف العقار من قائمة المفضلة", type: "ERROR" });
    },
  });
};