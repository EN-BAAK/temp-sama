import { keepPreviousData, QueryClient, useMutation, useQuery, useQueryClient, } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { EmployeeEntity, EmployeeEntityIdentifier } from "@/types/entities";
import { ID } from "@/types/global";
import { APIResponse, PaginationResponse } from "@/libraries/react-query/types";
import { useOffsetContext } from "@/libraries/offset/OffsetsProvider";
import { UpdateOffsetUnitProcess } from "@/libraries/offset/types";
import { useAppContext } from "@/libraries/project-provider/AppProvider";
import { createEmployee, deleteEmployeeById, getAllEmployees, getAllEmployeesIdentifiers, getEmployeeById, updateEmployee } from "@/api-client";
import { EnableParams } from "@/types/queries";

const LIMIT = 9;

const employeesBaseKey = "employees";
const employeeBaseKey = "employee";
const EmployeeIdentifiersBaseKey = "employees-identifiers"

const OFFSET_KEY = [employeesBaseKey, LIMIT]


export const removeDerivedSearchCaches = (queryClient: QueryClient) => {
  queryClient.removeQueries({
    predicate: (query) => {
      const [baseKey, , , search] = query.queryKey;

      return (
        baseKey === employeesBaseKey &&
        typeof search === "string" &&
        search.trim() !== ""
      );
    },
  });
};

export const useGetAllEmployees = (page: number, search: string = "") => {
  const queryKey = [employeesBaseKey, LIMIT, page, search];

  const { getOffsetUnit } = useOffsetContext();
  const offset = getOffsetUnit(OFFSET_KEY);

  return useQuery({
    queryKey,
    queryFn: () => getAllEmployees({ limit: LIMIT, page, search, offset }),
    placeholderData: keepPreviousData,
    retry: false,
  });
};

export const useGetEmployeesIdentifiers = ({ enable = true }: EnableParams) => {
  return useQuery({
    queryKey: [EmployeeIdentifiersBaseKey],
    queryFn: getAllEmployeesIdentifiers,
    enabled: enable,
    retry: false,
  });
};

export const useGetEmployeeById = (id: ID) => {
  return useQuery({
    queryKey: [employeeBaseKey, id],
    queryFn: () => getEmployeeById(id),
    enabled: Boolean(id),
    retry: false,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const { updateOffsetUnit } = useOffsetContext();
  const { pushToast } = useAppContext();
  const router = useRouter();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: (newEmployeeResponse) => {
      const newEmployee = newEmployeeResponse.data;

      queryClient.setQueriesData<PaginationResponse<EmployeeEntity>>(
        {
          predicate: (query) => {
            const [baseKey, , page] = query.queryKey;
            return baseKey === employeesBaseKey && page === 1;
          },
        },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: [newEmployee, ...oldData.data.items],
            },
          };
        }
      );

      queryClient.setQueryData<APIResponse<EmployeeEntityIdentifier[]>>(
        [EmployeeIdentifiersBaseKey],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: [{ id: newEmployee.id, fullName: newEmployee.fullName, phone: newEmployee.phone }, ...old.data],
          };
        }
      );

      pushToast({ message: "تم إضافة الموظف بنجاح", type: "SUCCESS" });
      updateOffsetUnit(OFFSET_KEY, UpdateOffsetUnitProcess.UP);
      removeDerivedSearchCaches(queryClient);
      router.back();
    },
    onError: () => {
      pushToast({ message: "فشل إضافة الموظف", type: "ERROR" });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();
  const router = useRouter();

  const rootQueryKey = [employeesBaseKey];

  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: (updatedResponse, { id }) => {
      const updatedEmployee = updatedResponse.data;

      queryClient.setQueriesData<PaginationResponse<EmployeeEntity>>(
        { queryKey: rootQueryKey },
        (oldData) => {
          if (!oldData?.data?.items) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((item) =>
                item.id === updatedEmployee.id ? updatedEmployee : item
              ),
            },
          };
        }
      );

      queryClient.setQueryData<APIResponse<EmployeeEntity>>(
        [employeeBaseKey, id],
        (old) => (old ? { ...old, data: { ...old.data, ...updatedEmployee } } : old)
      );

      queryClient.setQueryData<APIResponse<EmployeeEntityIdentifier[]>>(
        [EmployeeIdentifiersBaseKey],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((item) =>
              item.id === id ? { id: updatedEmployee.id, fullName: updatedEmployee.fullName, phone: updatedEmployee.phone } : item
            ),
          };
        }
      );

      removeDerivedSearchCaches(queryClient);
      pushToast({ message: "تم تعديل الموظف بنجاح", type: "SUCCESS" });
      router.back();
    },
    onError: () => {
      pushToast({ message: "فشل تعديل الموظف", type: "ERROR" });
    },
  });
};

export const useDeleteEmployeeById = () => {
  const { updateOffsetUnit } = useOffsetContext();
  const { pushToast } = useAppContext();
  const queryClient = useQueryClient();

  const rootQueryKey = [employeesBaseKey];

  return useMutation({
    mutationFn: deleteEmployeeById,
    onSuccess: (_, id) => {
      queryClient.setQueriesData<PaginationResponse<EmployeeEntity>>(
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

      queryClient.setQueryData<APIResponse<EmployeeEntityIdentifier[]>>(
        [EmployeeIdentifiersBaseKey],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((item) => item.id !== id),
          };
        }
      );

      updateOffsetUnit(OFFSET_KEY, UpdateOffsetUnitProcess.DOWN);
      queryClient.removeQueries({ queryKey: [employeeBaseKey, id], exact: true });
      removeDerivedSearchCaches(queryClient);
      pushToast({ message: "تم حذف الموظف بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل حذف الموظف", type: "ERROR" });
    },
  });
};