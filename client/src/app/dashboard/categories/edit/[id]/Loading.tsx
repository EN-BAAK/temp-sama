import React from 'react';
import { Skeleton } from '@/libraries/components/Skeleton';

const Loading: React.FC = () => {
  const iconGridItems = Array.from({ length: 12 });

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
        <Skeleton variant="rectangular" className="h-9 w-9 rounded-xl" />

        <div className="space-y-2">
          <Skeleton variant="text" className="h-5 w-44" />
          <Skeleton variant="text" className="h-3 w-64" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-6">
          <div className="max-w-md space-y-2">
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="rectangular" className="h-10 w-full rounded-lg" />
          </div>

          <div className="space-y-3">
            <Skeleton variant="text" className="h-4 w-28" />

            <div className="flex flex-wrap gap-3">
              {iconGridItems.map((_, idx) => (
                <Skeleton
                  key={`skeleton-icon-picker-${idx}`}
                  variant="rectangular"
                  className="h-11 w-11 rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form Action ooter Skeleton */}
        <div className="flex items-center justify-end border-t border-border pt-5">
          <Skeleton variant="rectangular" className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Loading;