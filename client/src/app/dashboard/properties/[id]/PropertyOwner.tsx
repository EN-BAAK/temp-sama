'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { handlePhoneCall } from '@/utils/helpers';
import Button from '@/libraries/forms/components/Button';
import { useRouter } from 'next/navigation';
import { DashboardPropertyOwnerProps } from '@/types/components';
import { useGetPropertyOwner } from '@/features/useProperties';
import { Link } from '@/libraries/components/Link';
import Badge from '@/components/Badge';
import Loading from './PropertyOwnerLoading';

const PropertyOwner: React.FC<DashboardPropertyOwnerProps> = ({ id }) => {
  const router = useRouter();

  const { data, isLoading } = useGetPropertyOwner(id);
  const owner = data?.data;

  const goToOwner = () => router.push(`/dashboard/owners/${owner.id}`)

  if (isLoading) return <Loading />

  if (!owner) return null;

  const onCall = () => {
    if (owner.phone) handlePhoneCall(owner.phone);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm font-sans">
      <h3 className="mb-4 font-heading font-semibold text-text">بيانات المالك</h3>
      <div className="mb-4 flex items-center gap-3">
        <Avatar name={owner.fullName} size="lg" />
        <div>
          <div className="font-semibold text-text">{owner.fullName}</div>
          <div className="text-sm text-muted">مالك العقار</div>
        </div>
      </div>

      {owner.phone && (
        <div className='flex items-center gap-3'>
          <Badge
            icon={Phone}
            variant='transparent'
            iconClassName='w-3.5 h-3.5'
            className='p-0 w-8 h-8'
          />
          <Link
            action={onCall}
            value={owner.phone}
          />
        </div>
      )}

      <Button
        variant="transparent-outline"
        onClick={goToOwner}
        className="mt-4 w-full"
        label='عرض الملف الكامل'
      />
    </div>
  );
};

export default PropertyOwner;