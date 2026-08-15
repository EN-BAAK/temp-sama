import React from 'react';
import { Skeleton } from '@/libraries/components/Skeleton';
import { range } from '@/utils/helpers';

const PropertiesLoading: React.FC = () => {
  const skeleton = range(3)

  return (
    <div className="space-y-2.5">
      {skeleton.map((_, idx) => (
        <div
          key={`unsigned-prop-skeleton-${idx}`}
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
        >
          <div className="flex flex-1 items-center gap-3">
            <Skeleton variant="rectangular" className="h-12 w-12 shrink-0 rounded-lg" />

            <div className="flex-1 space-y-1.5">
              <Skeleton variant="text" className="h-4 w-3/4 max-w-[160px]" />
              <Skeleton variant="text" className="h-3 w-16" />
            </div>
          </div>

          <Skeleton variant="rectangular" className="h-8 w-16 shrink-0 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export default PropertiesLoading;