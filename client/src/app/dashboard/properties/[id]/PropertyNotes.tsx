'use client';

import React from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { useGetPropertyNotes, useCreatePropertyNote, useDeletePropertyNote, } from '@/features/useProperties';
import { PropertyNoteEntity } from '@/types/entities';
import { validationClientNoteSchema } from '@/constants/formsValidations';
import TextAreaField from '@/libraries/forms/components/TextAreaField';
import { initialClientNoteValues } from '@/constants/formsValues';
import SubmitButton from '@/libraries/forms/components/SubmitButton';
import Note from './Note';
import { useAppContext } from '@/libraries/project-provider/AppProvider';
import { ID } from '@/types/global';
import { DashboardPropertyNotesProps } from '@/types/components';

export const PropertyNotes: React.FC<DashboardPropertyNotesProps> = ({ id }) => {
  const { showWarning } = useAppContext();
  const { data } = useGetPropertyNotes(id);
  const { mutateAsync: deleteNote, isPending: isNoteDeleting } =useDeletePropertyNote();
  const { mutateAsync: createNote } = useCreatePropertyNote();
  const notes: PropertyNoteEntity[] = data?.data || [];

  const handleSubmit = async (
    values: { note: string },
    helper: FormikHelpers<{ note: string }>
  ) => {
    try {
      await createNote({
        propertyId: id,
        payload: values,
      });

      helper.resetForm();
    } catch (error) {
      console.error('Failed to create property note:', error);
    }
  };

  const handleDelete = async (noteId: ID) => {
    showWarning({
      message: `هل أنت متأكد من حذف هذه الملاحظة نهائياً؟`,
      btn1: 'إغلاق',
      btn2: 'حذف',
      handleBtn2: () => deleteNote({ propertyId: id, noteId }),
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
                className='w-fit px-7'
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PropertyNotes;