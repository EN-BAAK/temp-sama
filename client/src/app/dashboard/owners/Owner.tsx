'use client';

import React from 'react';
import Avatar from '@/components/Avatar';
import { Link } from '@/libraries/components/Link';
import Button from '@/libraries/forms/components/Button';
import { DashboardOwnerRowProps } from '@/types/components';
import { handlePhoneCall } from '@/utils/helpers';
import { Edit, Eye, Trash2 } from 'lucide-react';

const Owner: React.FC<DashboardOwnerRowProps> = ({
  owner,
  handleDelete,
  handleEdit,
  handleView,
  isLoading = false,
}) => {
  const onView = () => handleView(owner.id);
  const onEdit = () => handleEdit(owner.id);
  const onDelete = () => handleDelete(owner.id, owner.fullName);
  const onCall = () =>
    owner.phone ? handlePhoneCall(owner.phone) : undefined;

  return (
    <tr className="group transition-colors hover:bg-background/70">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={owner.fullName} />
          <div>
            <div className="font-heading font-medium text-text">
              {owner.fullName}
            </div>
            {owner.phone && (
              <div dir="ltr" className="font-sans text-xs text-muted text-right">
                <Link value={owner.phone} action={onCall} />
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-4 text-text">
        {owner.email || '-'}
      </td>

      <td className="px-5 py-4 text-text">
        {owner.city?.name || '-'}
      </td>

      <td className="px-5 py-4 text-left">
        <div className="flex items-center justify-end gap-1 md:opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="transparent-info"
            onClick={onView}
            icon={Eye}
            disabled={isLoading}
            aria-label="عرض التفاصيل"
            className="w-fit"
            iconClassName="w-4 h-4"
          />
          <Button
            variant="transparent-warning"
            onClick={onEdit}
            icon={Edit}
            disabled={isLoading}
            aria-label="تعديل المالك"
            className="w-fit"
            iconClassName="w-4 h-4"
          />
          <Button
            variant="transparent-danger"
            onClick={onDelete}
            icon={Trash2}
            disabled={isLoading}
            aria-label="حذف المالك"
            className="w-fit"
            iconClassName="w-4 h-4"
          />
        </div>
      </td>
    </tr>
  );
};

export default Owner;