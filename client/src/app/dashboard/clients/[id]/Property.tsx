import { DashboardClientPropertyProps } from '@/types/components'
import Image from 'next/image';
import React, { useState } from 'react'
import PropertyImageLoading from '../../properties/PropertyImageLoading';
import { getImageUrl } from '@/utils/helpers';
import PropertyNoImage from '../../properties/PropertyNoImage';
import Badge from '@/components/Badge';

const Property: React.FC<DashboardClientPropertyProps> = ({ handleSelect, property }) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isError, setIsError] = useState(false);

  const stopLoadingImage = () => setIsLoadingImage(false);
  const ImageFailed = () => {
    setIsLoadingImage(false);
    setIsError(true);
  };

  const onSelect = () => handleSelect(property.id)

  return (
    <button
      key={String(property.id)}
      type="button"
      onClick={onSelect}
      className="relative overflow-hidden rounded-xl border bg-card text-start transition border-border hover:border-accent"
    >
      <div className="h-32 w-full bg-background2">
        <React.Fragment>
          {(isLoadingImage && property.backgroundUrl) && <PropertyImageLoading />}

          {(!isError && property.backgroundUrl) ? (
            <Image
              fill
              onLoad={stopLoadingImage}
              onError={ImageFailed}
              src={getImageUrl(property.backgroundUrl)}
              alt="صورة العقار"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${isLoadingImage ? 'opacity-0' : 'opacity-100'
                }`}
            />
          ) : (
            <PropertyNoImage />
          )}
        </React.Fragment>
      </div>

      <div className="absolute top-2 right-2">
        <Badge
          label={property.title || `عقار رقم ${property.id}`}
          variant='transparent'
        />
      </div>
    </button>
  )
}

export default Property