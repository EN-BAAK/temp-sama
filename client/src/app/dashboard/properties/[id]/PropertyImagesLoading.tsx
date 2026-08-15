import React from 'react';
import { Skeleton } from '@/libraries/components/Skeleton';

const Loading: React.FC = () => {
  const skeletonImages = Array.from({ length: 6 });

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <Skeleton variant="text" className="mb-4 h-6 w-28" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {skeletonImages.map((_, idx) => (
          <Skeleton
            key={`skeleton-image-${idx}`}
            variant="rectangular"
            className="aspect-square w-full rounded-xl"
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;