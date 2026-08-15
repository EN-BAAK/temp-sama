"use client";

import React, { useMemo } from "react";
import { Building, X } from "lucide-react";
import { useCreateClientFavorite } from "@/features/useClients";
import { useGetPropertyIdentifiers } from "@/features/useProperties";
import { PropertyIdentifiersEntity } from "@/types/entities";
import { DashboardClientPropertiesListModalProps } from "@/types/components";
import { ID } from "@/types/global";
import Property from "./Property";

const PropertiesListModal: React.FC<DashboardClientPropertiesListModalProps> = ({ isOpen, clientId, favoriteIds, onClose, }) => {
  const { data, isLoading: isLoadingProperties, isError, } = useGetPropertyIdentifiers();
  const { mutateAsync, isPending: isAddingProperty, } = useCreateClientFavorite();

  const properties: PropertyIdentifiersEntity[] = useMemo(() => data?.data || [], [data]);

  const availableProperties = useMemo(() => {
    const favoritesSet = new Set(
      favoriteIds.map((favoriteId) => String(favoriteId)),
    );

    return properties.filter((property) => !favoritesSet.has(String(property.id)),);
  }, [favoriteIds, properties]);

  const handleSelect = async (propertyId: ID) => {
    await mutateAsync({
      clientId,
      propertyId
    })

    onClose()
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="properties-modal-title"
    >
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2
              id="properties-modal-title"
              className="font-heading text-lg font-bold text-text"
            >
              إضافة عقار إلى المفضلة
            </h2>

            <p className="mt-1 text-sm text-muted">
              اختر عقاراً ثم اضغط على موافق
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isAddingProperty}
            className="rounded-lg p-2 text-muted transition hover:bg-background2 hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {isLoadingProperties && (
            <div className="flex min-h-48 items-center justify-center">
              <p className="text-sm text-muted">
                جاري تحميل العقارات...
              </p>
            </div>
          )}

          {isError && (
            <div className="flex min-h-48 items-center justify-center">
              <p className="text-sm text-danger">
                حدث خطأ أثناء تحميل العقارات
              </p>
            </div>
          )}

          {!isLoadingProperties &&
            !isError &&
            availableProperties.length === 0 && (
              <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
                <div className="rounded-full bg-background2 p-4">
                  <Building className="text-muted" size={28} />
                </div>

                <p className="text-sm text-muted">
                  جميع العقارات موجودة في المفضلة
                </p>
              </div>
            )}

          {!isLoadingProperties &&
            !isError &&
            availableProperties.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {availableProperties.map((property) =>
                  <Property property={property} handleSelect={handleSelect} key={`av-property-${property.id}`} />
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesListModal;