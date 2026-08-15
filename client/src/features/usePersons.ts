import { createPersonNote, deletePersonNote, getPersonNotes } from "@/api-client";
import { useAppContext } from "@/libraries/project-provider/AppProvider";
import { APIResponse } from "@/libraries/react-query/types";
import { PersonNoteEntity } from "@/types/entities";
import { ID } from "@/types/global";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const personNotesBaseKey = "person-notes"

export const useGetPersonNotes = (personId: ID) => {
  return useQuery({
    queryKey: [personNotesBaseKey, personId],
    queryFn: () => getPersonNotes(personId),
    enabled: Boolean(personId),
    retry: false,
  });
};

export const useCreatePersonNote = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();

  return useMutation({
    mutationFn: createPersonNote,
    onSuccess: (newNoteResponse, { personId }) => {
      const newNote = newNoteResponse.data;

      queryClient.setQueryData<APIResponse<PersonNoteEntity[]>>(
        [personNotesBaseKey, personId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: [newNote, ...old.data],
          };
        }
      );
      pushToast({ message: "تم اضافة الملاحظة بنجاح", type: "SUCCESS" });
    },
    onError: () => {
      pushToast({ message: "فشل اضافة الملاحظة", type: "ERROR" });
    },
  });
};

export const useDeletePersonNote = () => {
  const queryClient = useQueryClient();
  const { pushToast } = useAppContext();

  return useMutation({
    mutationFn: deletePersonNote,
    onSuccess: (_, { personId, noteId }) => {
      queryClient.setQueryData<APIResponse<PersonNoteEntity[]>>(
        [personNotesBaseKey, personId],
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