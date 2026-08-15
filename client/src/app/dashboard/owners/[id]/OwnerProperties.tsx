'use client';

import React from 'react';
import { Plus, Building2 } from 'lucide-react';
import { ID } from '@/types/global';
import { useGetOwnerProperties, useUnassignPropertyFromOwner } from '@/features/useOwners';
import { useAppContext } from '@/libraries/project-provider/AppProvider';
import OwnerProperty from './OwnerProperty';
import Button from '@/libraries/forms/components/Button';
import { DashboardOwnerPropertiesProps } from '@/types/components';
import { OwnerPropertyEntity } from '@/types/entities';
import { useRouter } from 'next/navigation';
import OwnerPropertiesLoading from './OwnerPropertiesLoading';

const OwnerProperties: React.FC<DashboardOwnerPropertiesProps> = ({ ownerId, onOpenAssignModal, }) => {
  const router = useRouter()
  const { showWarning } = useAppContext();

  const { mutateAsync: unassignProperty, isPending: isUnassigning } = useUnassignPropertyFromOwner();
  const { data, isLoading } = useGetOwnerProperties(ownerId);

  const properties: OwnerPropertyEntity[] = data?.data || [];

  const handleUnlink = (propertyId: ID) => {
    showWarning({
      message: 'هل أنت متأكد من إلغاء ربط هذا العقار بالمالك؟',
      btn1: 'إلغلاق',
      btn2: 'إلغاء الربط',
      handleBtn2: () => unassignProperty({ ownerId, propertyId }),
    });
  };

  const handleViewProperty = (id: ID) => router.push(`/dashboard/properties/${id}`)

  return (
    <div className="rounded-2xl space-y-6 border border-border bg-card p-6 shadow-sm font-sans">
      <div className="mb-5 flex items-center justify-between">
        <div className='flex-1'>
          <h3 className="font-heading font-bold text-text">عقارات المالك</h3>
          <p className="mt-0.5 text-xs text-muted">
            إجمالي العقارات المسجلة ({properties.length})
          </p>
        </div>

        <Button
          variant="transparent"
          onClick={onOpenAssignModal}
          icon={Plus}
          className="text-xs sm:text-sm w-fit"
          label='ربط عقار'
          iconClassName='sm:w-4 sm:h-4 w-3.5 h-3.5'
        />
      </div>

      {isLoading ? (
        <OwnerPropertiesLoading />
      ) : properties.length === 0 ? (
        <div className="flex h-44 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/50 text-center">
          <Building2 className="mb-2 h-8 w-8 text-muted/50" />
          <p className="text-sm font-medium text-text">لا توجد عقارات مرتبطة بهذا المالك</p>
          <p className="mt-1 text-xs text-muted">
            يمكنك إضافة وإسناد عقارات غير مسجلة لمالك من الزر أعلاه.
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {properties.map((property) => (
            <OwnerProperty
              key={`owner-prop-${property.id}`}
              property={property}
              handleUnlink={handleUnlink}
              isUnlinking={isUnassigning}
              handleViewProperty={handleViewProperty}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerProperties;