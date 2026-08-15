'use client';

import React from 'react';
import Avatar from '@/components/Avatar';
import { Link } from '@/libraries/components/Link';
import Button from '@/libraries/forms/components/Button';
import { DashboardEmployeeRowProps } from '@/types/components';
import { handlePhoneCall } from '@/utils/helpers';
import { Edit, Trash2 } from 'lucide-react';

const Employee: React.FC<DashboardEmployeeRowProps> = ({ employee, handleDelete, handleEdit, isLoading = false, }) => {
  const onEdit = () => handleEdit(employee.id);
  const onDelete = () => handleDelete(employee.id, employee.fullName);
  const onCall = () =>
    employee.phone ? handlePhoneCall(employee.phone) : undefined;

  return (
    <tr className="group transition-colors hover:bg-background/70">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={employee.fullName} />
          <div>
            <div className="font-heading font-medium text-text">
              {employee.fullName}
            </div>
            {employee.phone && (
              <div dir="ltr" className="font-sans text-xs text-muted text-right">
                <Link value={employee.phone} action={onCall} />
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-4 text-text">
        {employee.email || '-'}
      </td>

      <td className="px-5 py-4 text-text">
        {employee.role || '-'}
      </td>

      <td className="px-5 py-4 text-left">
        <div className="flex items-center justify-end gap-1 md:opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="transparent-warning"
            onClick={onEdit}
            icon={Edit}
            disabled={isLoading}
            aria-label="تعديل الموظف"
            className="w-fit"
            iconClassName="w-4 h-4"
          />
          <Button
            variant="transparent-danger"
            onClick={onDelete}
            icon={Trash2}
            disabled={isLoading}
            aria-label="حذف الموظف"
            className="w-fit"
            iconClassName="w-4 h-4"
          />
        </div>
      </td>
    </tr>
  );
};

export default Employee;