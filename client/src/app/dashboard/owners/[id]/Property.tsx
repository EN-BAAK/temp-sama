'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { getImageUrl } from '@/utils/helpers';
import Button from '@/libraries/forms/components/Button';
import { DashboardOwnersPropertyProps } from '@/types/components';
import PropertyImageLoading from '../../properties/PropertyImageLoading';
import PropertyNoImage from '../../properties/PropertyNoImage';

const Property: React.FC<DashboardOwnersPropertyProps> = ({ property, handleSelect, isAssigning = false, }) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isError, setIsError] = useState(false);

  const stopLoadingImage = () => setIsLoadingImage(false);
  const ImageFailed = () => {
    setIsLoadingImage(false);
    setIsError(true);
  };

  const onSelect = () => handleSelect(property.id)

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:border-primary/30">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-card">
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
        <div>
          <h4 className="font-heading text-sm font-semibold text-text line-clamp-1">
            {property.title || 'عقار بدون عنوان'}
          </h4>
          <span className="text-xs text-muted">ID: {property.id}</span>
        </div>
      </div>

      <Button
        variant="transparent"
        onClick={onSelect}
        disabled={isAssigning}
        icon={Plus}
        className="text-xs w-fit"
        iconClassName='w-3.5 h-3.5'
        label='ربط'
      />
    </div>
  );
};

export default Property;