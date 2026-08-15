import React from 'react';
import { Skeleton } from '@/libraries/components/Skeleton';
import { range } from '@/utils/helpers';

const Loading: React.FC = () => {
  const skeletonCategories = range(6);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:lg:grid-cols-4 lg:grid-cols-5">
      {skeletonCategories.map((_, idx) => (
        <div
          key={`skeleton-category-${idx}`}
          className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Skeleton variant="rectangular" className="h-5 w-5 rounded-md bg-primary/20" />
                </div>

                <div>
                  <Skeleton variant="text" className="h-5 w-28" />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Skeleton variant="rectangular" className="h-7 w-7 rounded-md" />
                <Skeleton variant="rectangular" className="h-7 w-7 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;