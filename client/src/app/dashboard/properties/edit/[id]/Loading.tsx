import React from 'react';
import { Skeleton } from '@/libraries/components/Skeleton';

const Loading: React.FC = () => {
  const fields = Array.from({ length: 8 });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:rounded-2xl sm:p-6">
        <div className="flex items-center justify-between gap-4 sm:hidden">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" className="h-9 w-9 shrink-0" />
            <div className="space-y-1.5">
              <Skeleton variant="text" className="h-3 w-20" />
              <Skeleton variant="text" className="h-4 w-28" />
            </div>
          </div>
          <Skeleton variant="text" className="h-3 w-8" />
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border sm:hidden">
          <Skeleton variant="rectangular" className="h-full w-1/3" />
        </div>

        <div className="hidden items-center justify-between gap-4 sm:flex">
          {Array.from({ length: 3 }).map((_, index) => (
            <React.Fragment key={`step-skeleton-${index}`}>
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <Skeleton variant="circular" className="h-9 w-9 shrink-0" />
                <Skeleton variant="text" className="h-3 w-20" />
              </div>
              {index < 2 && (
                <div className="mx-3 h-0.5 flex-1">
                  <Skeleton variant="rectangular" className="h-full w-full" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:rounded-2xl sm:p-6 md:p-8">
        <div className="mb-5 flex items-start gap-3 border-b border-border pb-4 sm:mb-6 sm:items-center sm:pb-5">
          <Skeleton variant="rectangular" className="h-9 w-9 shrink-0 rounded-xl" />
          <div className="space-y-2">
            <Skeleton variant="text" className="h-5 w-36" />
            <Skeleton variant="text" className="h-3 w-56" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            {fields.map((_, idx) => (
              <div key={`form-field-skeleton-${idx}`} className="space-y-2">
                <Skeleton variant="text" className="h-4 w-24" />
                <Skeleton variant="rectangular" className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end border-t border-border pt-5">
            <Skeleton variant="rectangular" className="h-10 w-28 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;