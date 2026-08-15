// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { RoleEntity } from "@/types/entities";
// import { ID } from "@/types/global";
// import { APIResponse } from "@/libraries/react-query/types";
// import { useAppContext } from "@/libraries/project-provider/AppProvider";
// import { createRole, deleteRoleById, getAllPermissions, getAllRoles, getRoleById, updateRole, } from "@/api-client";

import { getAllRoles } from "@/api-client";
import { useQuery } from "@tanstack/react-query";

const rolesBaseKey = "roles";
// const roleBaseKey = "role";
// const permissionsBaseKey = "permissions";

// export const useGetAllPermissions = () => {
//   return useQuery({
//     queryKey: [permissionsBaseKey],
//     queryFn: getAllPermissions,
//     retry: false,
//   });
// };

export const useGetAllRoles = () => {
  return useQuery({
    queryKey: [rolesBaseKey],
    queryFn: getAllRoles,
    retry: false,
  });
};

// export const useGetRoleById = (id: ID) => {
//   return useQuery({
//     queryKey: [roleBaseKey, id],
//     queryFn: () => getRoleById(id),
//     enabled: Boolean(id),
//     retry: false,
//   });
// };

// export const useCreateRole = () => {
//   const queryClient = useQueryClient();
//   const { pushToast } = useAppContext();
//   const router = useRouter();

//   return useMutation({
//     mutationFn: createRole,
//     onSuccess: (newRoleResponse) => {
//       const newRole = newRoleResponse.data;

//       queryClient.setQueryData<APIResponse<RoleEntity[]>>(
//         [rolesBaseKey],
//         (old) => {
//           if (!old) return old;
//           return {
//             ...old,
//             data: [newRole, ...old.data],
//           };
//         }
//       );

//       pushToast({ message: "تم إضافة الدور بنجاح", type: "SUCCESS" });
//       router.back();
//     },
//     onError: () => {
//       pushToast({ message: "فشل إضافة الدور", type: "ERROR" });
//     },
//   });
// };

// export const useUpdateRole = () => {
//   const queryClient = useQueryClient();
//   const { pushToast } = useAppContext();
//   const router = useRouter();

//   return useMutation({
//     mutationFn: updateRole,
//     onSuccess: (updatedResponse, { id }) => {
//       const updatedRole = updatedResponse.data;

//       queryClient.setQueryData<APIResponse<RoleEntity[]>>(
//         [rolesBaseKey],
//         (old) => {
//           if (!old) return old;
//           return {
//             ...old,
//             data: old.data.map((item) =>
//               item.id === id ? { ...item, ...updatedRole } : item
//             ),
//           };
//         }
//       );

//       queryClient.setQueryData<APIResponse<RoleEntity>>(
//         [roleBaseKey, id],
//         (old) => (old ? { ...old, data: { ...old.data, ...updatedRole } } : old)
//       );

//       pushToast({ message: "تم تعديل الدور بنجاح", type: "SUCCESS" });
//       router.back();
//     },
//     onError: () => {
//       pushToast({ message: "فشل تعديل الدور", type: "ERROR" });
//     },
//   });
// };

// export const useDeleteRoleById = () => {
//   const queryClient = useQueryClient();
//   const { pushToast } = useAppContext();

//   return useMutation({
//     mutationFn: deleteRoleById,
//     onSuccess: (_, id) => {
//       queryClient.setQueryData<APIResponse<RoleEntity[]>>(
//         [rolesBaseKey],
//         (old) => {
//           if (!old) return old;
//           return {
//             ...old,
//             data: old.data.filter((item) => item.id !== id),
//           };
//         }
//       );

//       queryClient.removeQueries({
//         queryKey: [roleBaseKey, id],
//         exact: true,
//       });

//       pushToast({ message: "تم حذف الدور بنجاح", type: "SUCCESS" });
//     },
//     onError: () => {
//       pushToast({ message: "فشل حذف الدور", type: "ERROR" });
//     },
//   });
// };