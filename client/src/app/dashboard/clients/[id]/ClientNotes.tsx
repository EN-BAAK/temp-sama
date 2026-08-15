"use client";

import React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { DashboardClientNotesProps } from "@/types/components";
import { validationClientNoteSchema } from "@/constants/formsValidations";
import TextAreaField from "@/libraries/forms/components/TextAreaField";
import { initialClientNoteValues } from "@/constants/formsValues";
import SubmitButton from "@/libraries/forms/components/SubmitButton";
import Note from "./Note";
import { useAppContext } from "@/libraries/project-provider/AppProvider";
import { ID } from "@/types/global";
import { useCreatePersonNote, useDeletePersonNote, useGetPersonNotes } from "@/features/usePersons";
import { PersonNoteEntity, PersonNoteEntityCreation } from "@/types/entities";

export const ClientNotes: React.FC<DashboardClientNotesProps> = ({ id }) => {
  const { showWarning } = useAppContext()
  const { data } = useGetPersonNotes(id);
  const { mutateAsync: deleteNote, isPending: isNoteDeleting } = useDeletePersonNote();
  const { mutateAsync: createNote } = useCreatePersonNote();
  const notes: PersonNoteEntity[] = data?.data || [];

  const handleSubmit = async (
    values: PersonNoteEntityCreation,
    helper: FormikHelpers<PersonNoteEntityCreation>
  ) => {
    try {
      await createNote({
        personId: id,
        payload: values,
      });

      helper.resetForm();
    } catch (error) {
      console.error("Failed to create client note:", error);
    }
  };

  const handleDelete = async (noteId: ID) => {
    showWarning({
      message: `هل انت متاكد من حذف هذه الملاحظة نهائياً؟`,
      btn1: "إغلاق",
      btn2: "حذف",
      handleBtn2: () => deleteNote({ personId: id, noteId: noteId }),
    });
  };

  return (
    <div className="font-sans">
      {notes.length > 0 && (
        <div className="mb-6 space-y-4">
          {notes.map((n) => (
            <Note
              key={`note-${n.id}`}
              note={n}
              handleDelete={handleDelete}
              isDeleting={isNoteDeleting}
            />
          ))}
        </div>
      )}

      <Formik
        initialValues={initialClientNoteValues}
        validationSchema={validationClientNoteSchema}
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting, isValid }) => (
          <Form className="space-y-4">
            <TextAreaField
              name="note"
              placeholder="أضف ملاحظة..."
              dir="rtl"
              rows={4}
            />

            <div className="flex items-center justify-end">
              <SubmitButton
                isDirty={dirty}
                isSubmitting={isSubmitting}
                isValid={isValid}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};