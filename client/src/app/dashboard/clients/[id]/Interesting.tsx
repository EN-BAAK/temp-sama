import { DashboardClientFavoritesProps } from '@/types/components'
import React, { useState } from 'react'
import PropertyImageLoading from '../../properties/PropertyImageLoading'
import Image from 'next/image';
import { formatBalance, getImageUrl } from '@/utils/helpers';
import PropertyNoImage from '../../properties/PropertyNoImage';
import { MapPin, Trash2 } from 'lucide-react';
import { FEATURE_ICONS_MAP } from '@/libraries/forms/constants';
import Button from '@/libraries/forms/components/Button';

const Interesting: React.FC<DashboardClientFavoritesProps> = ({ fav: favorite, handleView, handleDelete, isDeleting = false }) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isError, setIsError] = useState(false);

  const stopLoadingImage = () => setIsLoadingImage(false);
  const ImageFailed = () => {
    setIsLoadingImage(false);
    setIsError(true);
  };

  const onView = () => handleView(favorite.propertyId)
  const onDelete = () => handleDelete(favorite.id, favorite.title)

  const Icon =
    FEATURE_ICONS_MAP[favorite?.category?.icon as keyof typeof FEATURE_ICONS_MAP] ||
    FEATURE_ICONS_MAP['default'];

  return (
    <article
      key={String(favorite.id)}
      className="flex overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-sm"
    >
      <div className="relative h-32 sm:h-26 sm:w-22 w-26 shrink-0 bg-background2 sm:w-40">
        <React.Fragment>
          {(isLoadingImage && favorite.backgroundUrl) && <PropertyImageLoading />}

          {(!isError && favorite.backgroundUrl) ? (
            <Image
              fill
              onLoad={stopLoadingImage}
              onError={ImageFailed}
              src={getImageUrl(favorite.backgroundUrl)}
              alt="صورة العقار"
              className='sm:object-fill object-cover'
            />
          ) : (
            <PropertyNoImage />
          )}
        </React.Fragment>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-4">
        <div className="flex items-center justify-between">
          <Button
            className="w-fit truncate font-heading font-bold px-0"
            label={favorite.title ?? `عقار رقم ${favorite.id}`}
            variant='transparent-primary'
            onClick={onView}
            disabled={isDeleting}
          />

          <Button
            icon={Trash2}
            variant='transparent-danger'
            className='w-fit'
            iconClassName='w-3.5 h-3.5'
            onClick={onDelete}
            disabled={isDeleting}
          />
        </div>

        <div className="flex items-center justify-between flex-wrap">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            {favorite.city?.name && (
              <span className="flex items-center gap-1">
                <MapPin size={15} />
                {favorite.city.name}
              </span>
            )}

            {favorite.category?.name && (
              <span className="flex items-center gap-1">
                <Icon size={15} />
                {favorite.category.name}
              </span>
            )}
          </div>

          {favorite.price !== undefined && (
            <p className="font-semibold text-primary">
              {formatBalance(favorite.price)}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export default Interesting