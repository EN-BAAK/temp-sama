'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import Button from '@/libraries/forms/components/Button';
import { DashboardOwnerNoteProps } from '@/types/components';

const Note: React.FC<DashboardOwnerNoteProps> = ({ note, handleDelete, isDeleting = false }) => {
  const onDelete = () => handleDelete(note.id)

  return (
    <div className="group relative flex items-start justify-between gap-3 rounded-xl bg-warning/10 p-4 text-sm leading-relaxed text-warning">
      <p className="font-heading text-sm font-medium text-text whitespace-pre-line flex-1">
        {note.note}
      </p>

      <Button
        icon={Trash2}
        iconClassName="w-4 h-4"
        onClick={onDelete}
        disabled={isDeleting}
        aria-label="حذف الملاحظة"
        variant='transparent-danger'
        className="w-fit p-0 transition-opacity duration-200 500 disabled:cursor-not-allowed disabled:opacity-50 opacity-100 md:opacity-0 md:group-hover:opacity-100"
      />
    </div>
  );
};

export default Note;