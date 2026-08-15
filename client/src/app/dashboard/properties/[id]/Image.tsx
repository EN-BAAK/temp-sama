'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { getImageUrl } from '@/utils/helpers';
import { DashboardImageCardProps } from '@/types/components';
import PropertyImageLoading from '../PropertyImageLoading';
import PropertyNoImage from '../PropertyNoImage';
import { useFileViewerContext } from '@/contexts/FileViewerProvider';
import { FileViewerType } from '@/types/variables';

const ImageCard: React.FC<DashboardImageCardProps> = ({ image }) => {
  const { openFile } = useFileViewerContext()
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isError, setIsError] = useState(false);

  const stopLoadingImage = () => setIsLoadingImage(false);
  const ImageFailed = () => {
    setIsLoadingImage(false);
    setIsError(true);
  };

  const onView = () => openFile({ url: getImageUrl(image.imageUrl), type: FileViewerType.IMAGE })

  return (
    <div className="group relative h-28 w-full overflow-hidden rounded-xl border border-border bg-background transition-all hover:border-primary/30 hover:shadow-sm">
      <React.Fragment>
        {isLoadingImage && <PropertyImageLoading />}

        {!isError ? (
          <NextImage
            fill
            onLoad={stopLoadingImage}
            onError={ImageFailed}
            src={getImageUrl(image.imageUrl)}
            alt="صورة العقار"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-all duration-500 group-hover:scale-105 cursor-pointer ${isLoadingImage ? 'opacity-0' : 'opacity-100'
              }`}
            onClick={onView}
          />
        ) : (
          <PropertyNoImage />
        )}
      </React.Fragment>
    </div>
  );
};

export default ImageCard;