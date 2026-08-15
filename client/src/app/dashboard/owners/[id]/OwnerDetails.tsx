'use client';

import React from 'react';
import { Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { handlePhoneCall } from '@/utils/helpers';
import { DashboardOwnerDetailsProps } from '@/types/components';
import Avatar from '@/components/Avatar';
import Button from '@/libraries/forms/components/Button';
import { Link } from '@/libraries/components/Link';

const OwnerDetails: React.FC<DashboardOwnerDetailsProps> = ({ owner, onEdit, disabled = false, onDelete }) => {
  const onCall = () => owner.phone ? handlePhoneCall(owner.phone) : undefined;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Avatar name={owner?.fullName} />

          <h1 className="font-heading text-2xl font-bold text-text">
            {owner?.fullName}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="transparent-warning"
            onClick={onEdit}
            icon={Edit}
            disabled={disabled}
            aria-label="تعديل بيانات المالك"
            iconClassName='w-4 h-4'
            className='w-fit px-1'
          />
          <Button
            variant="transparent-danger"
            onClick={onDelete}
            icon={Trash2}
            disabled={disabled}
            aria-label="حذف المالك"
            iconClassName='w-4 h-4'
            className='w-fit px-1'
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {owner?.phone && (
          <React.Fragment>
            <Phone className="h-4 w-4 text-primary" />
            <Link
              value={owner.phone}
              action={onCall}
              className="flex items-center gap-1.5 text-text transition-colors hover:text-primary"
            />
          </React.Fragment>
        )}
        {owner?.email && (
          <div className="flex items-center gap-1.5 text-muted">
            <Mail className="h-4 w-4 text-primary" />
            <span>{owner?.email}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDetails;