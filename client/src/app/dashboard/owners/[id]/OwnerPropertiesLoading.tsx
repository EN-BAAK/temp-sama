import React from 'react';
import { Skeleton } from '@/libraries/components/Skeleton';
import { range } from '@/utils/helpers';

const OwnerPropertiesLoading: React.FC = () => {
  const skeleton = range(1);

  return (
    <div className="space-y-4">
      {skeleton.map((_, idx) => (
        <div
          key={`owner-prop-skeleton-${idx}`}
          className="flex flex-col sm:flex-row overflow-hidden rounded-xl border border-border bg-background"
        >
          <Skeleton
            variant="rectangular"
            className="h-45 sm:h-auto w-full sm:w-60 shrink-0"
          />

          <div className="flex flex-1 flex-col justify-between p-3.5">
            <div>
              <Skeleton variant="text" className="h-5 w-2/5 max-w-[180px]" />

              <div className="mt-2 flex items-center gap-3">
                <Skeleton variant="text" className="h-3 w-16" />
                <Skeleton variant="text" className="h-3 w-16" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-2">
              <Skeleton variant="text" className="h-4 w-20" />
              <Skeleton variant="rectangular" className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OwnerPropertiesLoading;