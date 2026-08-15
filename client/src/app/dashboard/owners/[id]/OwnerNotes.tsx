'use client';

import React from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { validationClientNoteSchema } from '@/constants/formsValidations';
import { initialClientNoteValues } from '@/constants/formsValues';
import TextAreaField from '@/libraries/forms/components/TextAreaField';
import SubmitButton from '@/libraries/forms/components/SubmitButton';
import Note from './Note';
import { useAppContext } from '@/libraries/project-provider/AppProvider';
import { ID } from '@/types/global';
import { DashboardOwnerNotesProps } from '@/types/components';
import { useCreatePersonNote, useDeletePersonNote, useGetPersonNotes } from '@/features/usePersons';
import { PersonNoteEntity } from '@/types/entities';

export const OwnerNotes: React.FC<DashboardOwnerNotesProps> = ({ ownerId }) => {
  const { showWarning } = useAppContext();
  const { data } = useGetPersonNotes(ownerId);
  const { mutateAsync: deleteNote, isPending: isNoteDeleting } = useDeletePersonNote();
  const { mutateAsync: createNote } = useCreatePersonNote();

  const notes: PersonNoteEntity[] = data?.data || [];

  const handleSubmit = async (
    values: { note: string },
    helper: FormikHelpers<{ note: string }>
  ) => {
    try {
      await createNote({
        personId: ownerId,
        payload: values,
      });

      helper.resetForm();
    } catch (error) {
      console.error('Failed to create owner note:', error);
    }
  };

  const handleDelete = async (noteId: ID) => {
    showWarning({
      message: `هل أنت متأكد من حذف هذه الملاحظة نهائياً؟`,
      btn1: 'إغلاق',
      btn2: 'حذف',
      handleBtn2: () => deleteNote({ personId: ownerId, noteId }),
    });
  };

  return (
    <div className="font-sans">
      {notes.length > 0 && (
        <div className="mb-6 space-y-3">
          {notes.map((n) => (
            <Note
              key={`owner-note-${n.id}`}
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
              placeholder="أضف ملاحظة للمالك..."
              dir="rtl"
              rows={3}
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

export default OwnerNotes;