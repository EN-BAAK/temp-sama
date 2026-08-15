"use client";

import React, { useMemo, useState } from "react";
import { Building } from "lucide-react";
import { useDeleteClientFavorites, useGetClientFavoritesById } from "@/features/useClients";
import Button from "@/libraries/forms/components/Button";
import { DashboardClientInterestingProps } from "@/types/components";
import { FavoritePropertyEntity } from "@/types/entities";
import Interesting from "./Interesting";
import PropertiesListModal from "./PropertiesListModal";
import { useRouter } from "next/navigation";
import { ID } from "@/types/global";
import { useAppContext } from "@/libraries/project-provider/AppProvider";

const Interestings: React.FC<DashboardClientInterestingProps> = ({ id, }) => {
  const router = useRouter()
  const { showWarning } = useAppContext()

  const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState(false)

  const { data, isLoading, isError, } = useGetClientFavoritesById(id);
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useDeleteClientFavorites()

  const favorites: FavoritePropertyEntity[] = useMemo(
    () => data?.data ?? [],
    [data]
  );
  const favoritePropertyIds = (favorites || []).map(f => f.propertyId)

  const handleViewProperty = (id: ID) => router.push(`/dashboard/properties/${id}`)
  const handleDelete = async (propertyId: ID, title?: string) => {
    showWarning({
      message: `هل أنت متأكد من حذف العقار "${title || propertyId}" من قائمة المفضلة؟`,
      btn1: "إغلاق",
      btn2: "حذف",
      handleBtn2: () => deleteMutation({ clientId: id, propertyId: propertyId }),
    });
  };

  return (
    <React.Fragment>
      <section className="flex min-h-[200px] flex-col font-sans">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-text">
              العقارات المفضلة
            </h2>

            <p className="mt-1 text-sm text-muted">
              عدد العقارات: {favorites.length}
            </p>
          </div>

          <Button
            className="w-fit px-4 sm:text-sm text-xs"
            iconClassName="sm:w-4 sm:h-4 w-3 h-3"
            label="إضافة عقارات"
            icon={Building}
            onClick={() => setIsPropertiesModalOpen(true)}
          />
        </div>

        {isLoading && (
          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-sm text-muted">
              جاري تحميل العقارات المفضلة...
            </p>
          </div>
        )}

        {!isLoading && !isError && favorites.length === 0 && (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-background">
            <div className="rounded-full bg-background2 p-4">
              <Building className="text-muted" size={28} />
            </div>

            <p className="text-sm text-muted">
              لا توجد عقارات مفضلة حالياً
            </p>
          </div>
        )}

        {!isLoading && !isError && favorites.length > 0 && (
          <div className="flex flex-col gap-3">
            {favorites.map((favorite) => <Interesting
              handleDelete={handleDelete}
              key={`interestings-${favorite.propertyId}`}
              fav={favorite}
              handleView={handleViewProperty}
              isDeleting={isDeleting}
            />)}
          </div>
        )}
      </section>

      <PropertiesListModal
        isOpen={isPropertiesModalOpen}
        clientId={id}
        favoriteIds={favoritePropertyIds}
        onClose={() => setIsPropertiesModalOpen(false)}
      />
    </React.Fragment>
  );
};

export default Interestings;