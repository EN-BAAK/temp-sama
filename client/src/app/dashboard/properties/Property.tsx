'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Bed, Bath, Maximize2, Edit, Eye, Trash2 } from 'lucide-react';
import Button from '@/libraries/forms/components/Button';
import { formatBalance, getImageUrl } from '@/utils/helpers';
import { DashboardPropertyProps } from '@/types/components';
import { DURATION_MAP, STATUS_MAP } from '@/constants/global';
import PropertyNoImage from './PropertyNoImage';
import PropertyImageLoading from './PropertyImageLoading';
import { PropertyPurpose } from '@/types/variables';

const Property: React.FC<DashboardPropertyProps> = ({ property, handleDelete, handleEdit, handleView, isLoading = false, }) => {
  const [isLoadingImageFailed, setIsLoadingImageFailed] = useState<boolean>(false)
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true)

  const stopLoadingImage = () => setIsLoadingImage(false)
  const ImageFailed = () => setIsLoadingImageFailed(true)

  const onView = (event?: React.SyntheticEvent) => {
    event?.stopPropagation();
    handleView(property.id);
  };

  const onEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleEdit(property.id);
  };

  const onDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleDelete(property.id, property.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onView(event);
    }
  };

  const statusConfig = STATUS_MAP[property.status] || {
    label: property.status,
    className: 'border border-border bg-background text-muted',
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onView}
      onKeyDown={handleKeyDown}
      aria-label={`عرض تفاصيل ${property.title || 'العقار'}`}
      className="
        group relative cursor-pointer overflow-hidden rounded-xl
        border border-border bg-card transition-all
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-primary focus-visible:ring-offset-2
        hover:border-primary/30 hover:shadow-md
        sm:rounded-2xl
      "
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-background sm:aspect-[16/9]">
        {!property.backgroundUrl || isLoadingImageFailed ? (
          <PropertyNoImage />
        ) : (
          <React.Fragment>
            {isLoadingImage && <PropertyImageLoading />}

            <Image
              fill
              onLoad={stopLoadingImage}
              onError={ImageFailed}
              src={getImageUrl(property.backgroundUrl)}
              alt={property.title || 'صورة العقار'}
              sizes="
          (max-width: 640px) 100vw,
          (max-width: 1024px) 50vw,
          33vw
        "
              className={`
          object-cover transition-all duration-500
          group-hover:scale-105
          ${isLoadingImage ? 'opacity-0' : 'opacity-100'}
        `}
            />
          </React.Fragment>
        )}

        <span
          className={`
            absolute right-2 top-2 rounded-md px-2 py-1
            font-sans text-[11px] font-medium
            sm:right-3 sm:top-3 sm:text-xs
            ${statusConfig.className}
          `}
        >
          {statusConfig.label}
        </span>

        <div
          className="
            absolute left-2 top-2 flex items-center gap-0.5
            rounded-xl bg-card/90 p-1 shadow-sm lg:backdrop-blur-sm
            transition-all duration-200
            sm:left-3 sm:top-3 sm:gap-1
            lg:translate-y-1 lg:opacity-0
            lg:group-hover:translate-y-0 lg:group-hover:opacity-100
            lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100
          "
        >
          <Button
            type="button"
            variant="transparent-info"
            onClick={onView}
            icon={Eye}
            disabled={isLoading}
            aria-label="عرض التفاصيل"
            className="h-8 w-8 p-0 sm:h-9 sm:w-9"
            iconClassName="h-4 w-4"
          />

          <Button
            type="button"
            variant="transparent-warning"
            onClick={onEdit}
            icon={Edit}
            disabled={isLoading}
            aria-label="تعديل العقار"
            className="h-8 w-8 p-0 sm:h-9 sm:w-9"
            iconClassName="h-4 w-4"
          />

          <Button
            type="button"
            variant="transparent-danger"
            onClick={onDelete}
            icon={Trash2}
            disabled={isLoading}
            aria-label="حذف العقار"
            className="h-8 w-8 p-0 sm:h-9 sm:w-9"
            iconClassName="h-4 w-4"
          />
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading text-sm font-semibold text-text sm:text-base">
              {property.title || 'بدون عنوان'}
            </h3>

            {property.location && <div className="mt-1 flex min-w-0 items-center gap-1 font-sans text-xs text-muted">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {property.location}
              </span>
            </div>}
          </div>

          <div className="shrink-0 text-left font-sans">
            <div className="whitespace-nowrap font-heading text-sm font-bold text-primary sm:text-base">
              {formatBalance(property.price)}
            </div>

            {(property.duration && property.purpose === PropertyPurpose.RENT) && (
              <div className="mt-0.5 text-xs text-muted">
                / {DURATION_MAP[property.duration]}
              </div>
            )}
          </div>
        </div>

        <div
          className="
            mt-3 flex flex-wrap items-center gap-x-3 gap-y-2
            border-t border-border pt-3
            font-sans text-xs text-muted
          "
        >
          {!!property.bedrooms && property.bedrooms > 0 && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Bed className="h-3.5 w-3.5 shrink-0" />
              <span>{property.bedrooms}</span>
            </span>
          )}

          {!!property.bathrooms && property.bathrooms > 0 && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Bath className="h-3.5 w-3.5 shrink-0" />
              <span>{property.bathrooms}</span>
            </span>
          )}

          {!!property.area && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Maximize2 className="h-3.5 w-3.5 shrink-0" />
              <span>{property.area} م²</span>
            </span>
          )}

          {property.category && (
            <span className="mr-auto max-w-full truncate font-medium text-muted/80">
              {property.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Property;