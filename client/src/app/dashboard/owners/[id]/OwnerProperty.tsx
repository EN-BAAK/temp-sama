'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Building, Unlink } from 'lucide-react';
import { formatBalance, getImageUrl } from '@/utils/helpers';
import Button from '@/libraries/forms/components/Button';
import { DashboardOwnerPropertyProps } from '@/types/components';
import PropertyImageLoading from '../../properties/PropertyImageLoading';
import PropertyNoImage from '../../properties/PropertyNoImage';


const OwnerProperty: React.FC<DashboardOwnerPropertyProps> = ({ property, handleUnlink, isUnlinking = false, handleViewProperty }) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isError, setIsError] = useState(false);

  const onUnlink = () => handleUnlink(property.id)
  const onView = () => handleViewProperty(property.id)

  const stopLoadingImage = () => setIsLoadingImage(false);
  const ImageFailed = () => {
    setIsLoadingImage(false);
    setIsError(true);
  };

  return (
    <div className="group relative flex sm:flex-row flex-col overflow-hidden rounded-xl border border-border bg-background transition-all hover:border-primary/30 hover:shadow-sm">
      <div className="relative h-45 sm:h-auto w-full sm:w-60 shrink-0 bg-card">
        <React.Fragment>
          {(isLoadingImage && property.backgroundUrl) && <PropertyImageLoading />}

          {(!isError && property.backgroundUrl) ? (
            <Image
              fill
              onLoad={stopLoadingImage}
              onError={ImageFailed}
              src={getImageUrl(property.backgroundUrl)}
              alt="صورة العقار"
              className='object-fill'
            />
          ) : (
            <PropertyNoImage />
          )}
        </React.Fragment>
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div>
          <Button
            onClick={onView}
            variant='transparent-primary'
            className="w-fit px-0 font-heading text-sm font-bold text-text line-clamp-1"
            label={property.title || 'عقار'}
          />

          <div className="mt-1.5 space-y-1 text-xs text-muted flex items-center gap-3">
            {property.city && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0 text-primary" />
                <span>{property.city.name}</span>
              </div>
            )}
            {property.category && (
              <div className="flex items-center gap-1">
                <Building className="h-3 w-3 shrink-0 text-primary" />
                <span>{property.category.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-2">
          <span className="font-heading text-sm font-bold text-primary">
            {property.price ? `${formatBalance(property.price)}` : 'غير محدد'}
          </span>

          <Button
            variant="transparent-danger"
            onClick={onUnlink}
            disabled={isUnlinking}
            icon={Unlink}
            className='w-fit'
            aria-label="إلغاء ربط العقار"
            iconClassName="w-3.5 h-3.5"
          />
        </div>
      </div>
    </div>
  );
};

export default OwnerProperty;