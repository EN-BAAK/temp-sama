'use client';

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Button from '@/libraries/forms/components/Button';
import { FEATURE_ICONS_MAP } from '@/libraries/forms/constants';
import { DashboardCategoryProps } from '@/types/components';
import Badge from '@/components/Badge';

const Category: React.FC<DashboardCategoryProps> = ({ category, handleDelete, handleEdit, isLoading = false, }) => {
  const onEdit = () => handleEdit(category.id);
  const onDelete = () => handleDelete(category.id, category.name);

  const Icon =
    FEATURE_ICONS_MAP[category.icon as keyof typeof FEATURE_ICONS_MAP] ||
    FEATURE_ICONS_MAP['default'];

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Badge icon={Icon} iconClassName='w-4 h-4' className='h-8 w-8' />
            <div>
              <h3 className="font-heading text-base font-semibold text-text text-sm">
                {category.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1 md:opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="transparent-warning"
              onClick={onEdit}
              icon={Edit}
              disabled={isLoading}
              aria-label="تعديل التصنيف"
              className="w-fit p-1"
              iconClassName="w-4 h-4"
            />
            <Button
              variant="transparent-danger"
              onClick={onDelete}
              icon={Trash2}
              disabled={isLoading}
              aria-label="حذف التصنيف"
              className="w-fit p-1"
              iconClassName="w-4 h-4"
            />
          </div>
        </div>
      </div>
    </div >
  );
};

export default Category;