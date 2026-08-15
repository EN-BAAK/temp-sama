'use client';

import React from 'react';
import { X, Building2 } from 'lucide-react';
import { ID } from '@/types/global';
import { useAssignPropertyToOwner } from '@/features/useOwners';
import { useGetUnsignedPropertyIdentifiers } from '@/features/useProperties';
import Property from './Property';
import { DashboardOwnersPropertiesModalProps } from '@/types/components';
import { PropertyIdentifiersEntity } from '@/types/entities';
import PropertiesLoading from './PropertiesLoading';

const PropertiesModal: React.FC<DashboardOwnersPropertiesModalProps> = ({ ownerId, isOpen, onClose, }) => {
  const { data, isLoading } = useGetUnsignedPropertyIdentifiers();
  const { mutateAsync: assignProperty, isPending: isAssigning } = useAssignPropertyToOwner();

  if (!isOpen) return null;

  const properties: PropertyIdentifiersEntity[] = data?.data || [];

  const handleAssign = async (propertyId: ID) => {
    try {
      await assignProperty({ ownerId, propertyId });
      onClose();
    } catch (error) {
      console.error('Failed to assign property:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm font-sans">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="font-heading font-bold text-text">ربط عقار غير محدد لمالك</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted transition-colors hover:bg-background hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {isLoading ? (
            <PropertiesLoading />
          ) : properties.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <Building2 className="mb-2 h-8 w-8 text-muted/40" />
              <p className="text-sm font-medium text-text">
                لا توجد عقارات بدون مالك حالياً
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {properties.map((prop) => (
                <Property
                  key={`unsigned-prop-${prop.id}`}
                  property={prop}
                  handleSelect={handleAssign}
                  isAssigning={isAssigning}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesModal;