'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import Button from '@/libraries/forms/components/Button';
import { DashboardPropertyNoteProps } from '@/types/components';

const Note: React.FC<DashboardPropertyNoteProps> = ({ note, handleDelete, isDeleting = false }) => {
  return (
    <div className="group relative flex items-start justify-between gap-4 rounded-xl border border-border bg-background p-4 shadow-sm transition-all hover:border-primary/20">
      <p className="whitespace-pre-wrap text-sm leading-6 text-text">{note.note}</p>
      <Button
        variant="transparent-danger"
        onClick={() => handleDelete(note.id)}
        icon={Trash2}
        disabled={isDeleting}
        aria-label="حذف الملاحظة"
        className="w-fit opacity-80 hover:opacity-100"
        iconClassName="w-4 h-4"
      />
    </div>
  );
};

export default Note;