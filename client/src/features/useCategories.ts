import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CategoryEntity } from "@/types/entities";
import { ID } from "@/types/global";
import { APIResponse } from "@/libraries/react-query/types";
import { useAppContext } from "@/libraries/project-provider/AppProvider";
import { createCategory, deleteCategoryById, getAllCategories, getCategoryById, updateCategory } from "@/api-client";

const categoriesBaseKey = "categories";
const categoryBaseKey = "category";

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: [categoriesBaseKey],
    queryFn: getAllCategories,
    retry: false,
  });
};

export const useGetCategoryById = (id: ID) => {
  return useQuery({
    queryKey: [categoryBaseKey, id],
    queryFn: () => getCategoryById(id),
    enabled: Boolean(id),
    retry: false,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();
  const router = useRouter();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategoryResponse) => {
      const newCategory = newCategoryResponse.data;

      queryClient.setQueryData<APIResponse<CategoryEntity[]>>(
        [categoriesBaseKey],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: [newCategory, ...old.data],
          };
        }
      );

      pushToast({ message: "تم إضافة الفئة بنجاح", type: "SUCCESS" });
      router.back();
    },
    onError: () => {
      pushToast({ message: "فشل إضافة الفئة", type: "ERROR" });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();
  const router = useRouter();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (updatedResponse, { id }) => {
      const updatedCategory = updatedResponse.data;

      queryClient.setQueryData<APIResponse<CategoryEntity[]>>(
        [categoriesBaseKey],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((item) =>
              item.id === id ? { ...item, ...updatedCategory } : item
            ),
          };
        }
      );

      queryClient.setQueryData<APIResponse<CategoryEntity>>(
        [categoryBaseKey, id],
        (old) => (old ? { ...old, data: { ...old.data, ...updatedCategory } } : old)
      );

      pushToast({ message: "تم تعديل الفئة بنجاح", type: "SUCCESS" });
      router.back();
    },
    onError: () => {
      pushToast({ message: "فشل تعديل الفئة", type: "ERROR" });
    },
  });
};

export const useDeleteCategoryById = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();

  return useMutation({
    mutationFn: deleteCategoryById,
    onSuccess: (_, id) => {
      queryClient.setQueryData<APIResponse<CategoryEntity[]>>(
        [categoriesBaseKey],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((item) => item.id !== id),
          };
        }
      );

      queryClient.removeQueries({
        queryKey: [categoryBaseKey, id],
        exact: true,
      });

      pushToast({ message: "تم حذف الفئة بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل حذف الفئة", type: "ERROR" });
    },
  });
};