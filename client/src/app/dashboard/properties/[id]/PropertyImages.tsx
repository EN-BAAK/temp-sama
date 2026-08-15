'use client';

import React from 'react';
import { PropertyImageEntity } from '@/types/entities';
import { useGetPropertyImages } from '@/features/useProperties';
import ImageCard from './Image';
import { DashboardPropertyImagesProps } from '@/types/components';
import Loading from './PropertyImagesLoading';

const PropertyImages: React.FC<DashboardPropertyImagesProps> = ({ id }) => {
  const { data, isLoading } = useGetPropertyImages(id);
  const images: PropertyImageEntity[] = data?.data || [];

  if (isLoading) 
    return <Loading />

  if (images.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 font-heading font-bold text-text">صور العقار</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img) => (
          <ImageCard key={`img-${img.id}`} image={img} />
        ))}
      </div>
    </div>
  );
};

export default PropertyImages;