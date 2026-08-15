import React from 'react';
import { Skeleton } from '@/libraries/components/Skeleton';

const Loading: React.FC = () => {
  const skeletonProperties = Array.from({ length: 6 });

  return (
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skeletonProperties.map((_, idx) => (
          <div
            key={`skeleton-property-${idx}`}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <div className="relative h-44 w-full">
              <Skeleton variant="rectangular" className="h-full w-full" />
              <div className="absolute right-3 top-3">
                <Skeleton variant="rectangular" className="h-6 w-16 rounded-md" />
              </div>
              <div className="absolute left-3 top-3 flex gap-1 rounded-xl bg-card/90 p-1">
                <Skeleton variant="rectangular" className="h-7 w-7 rounded-lg" />
                <Skeleton variant="rectangular" className="h-7 w-7 rounded-lg" />
                <Skeleton variant="rectangular" className="h-7 w-7 rounded-lg" />
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5 flex-1">
                  <Skeleton variant="text" className="h-4 w-3/4" />
                  <Skeleton variant="text" className="h-3 w-1/2" />
                </div>
                <div className="mr-3 space-y-1 text-left">
                  <Skeleton variant="text" className="h-4 w-16" />
                  <Skeleton variant="text" className="h-3 w-10" />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-3">
                  <Skeleton variant="rectangular" className="h-4 w-10 rounded" />
                  <Skeleton variant="rectangular" className="h-4 w-10 rounded" />
                  <Skeleton variant="rectangular" className="h-4 w-12 rounded" />
                </div>
                <Skeleton variant="text" className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Skeleton variant="rectangular" className="h-8 w-24 rounded-lg" />
          <div className="flex items-center gap-2">
            <Skeleton variant="rectangular" className="h-8 w-8 rounded-lg" />
            <Skeleton variant="rectangular" className="h-8 w-8 rounded-lg" />
            <Skeleton variant="rectangular" className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton variant="rectangular" className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Loading;