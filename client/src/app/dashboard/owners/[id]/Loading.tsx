import React from 'react';
import { Skeleton } from '@/libraries/components/Skeleton';

const Loading: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
            <Skeleton variant="text" className="h-7 w-44" />
          </div>

          <div className="flex items-center gap-2.5">
            <Skeleton variant="rectangular" className="h-9 w-9 rounded-xl" />
            <Skeleton variant="rectangular" className="h-9 w-9 rounded-xl" />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" className="h-4 w-4 shrink-0" />
            <Skeleton variant="text" className="h-4 w-28" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" className="h-4 w-4 shrink-0" />
            <Skeleton variant="text" className="h-4 w-36" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton variant="text" className="h-6 w-32" />
                <Skeleton variant="text" className="h-3 w-40" />
              </div>

              <Skeleton variant="rectangular" className="h-9 w-24 rounded-xl" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`owner-property-skeleton-${index}`}
                  className="flex flex-col sm:flex-row overflow-hidden rounded-xl border border-border bg-background"
                >
                  <Skeleton
                    variant="rectangular"
                    className="h-44 sm:h-32 w-full sm:w-60 shrink-0"
                  />
                  <div className="flex flex-1 flex-col justify-between p-3.5 space-y-3">
                    <div className="space-y-2">
                      <Skeleton variant="text" className="h-5 w-3/4" />
                      <div className="flex items-center gap-3">
                        <Skeleton variant="text" className="h-3 w-20" />
                        <Skeleton variant="text" className="h-3 w-20" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-2">
                      <Skeleton variant="text" className="h-5 w-24" />
                      <Skeleton variant="rectangular" className="h-8 w-8 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm space-y-5">
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton
                  key={`owner-note-skeleton-${index}`}
                  variant="rectangular"
                  className="h-16 w-full rounded-xl"
                />
              ))}
            </div>

            <div className="space-y-4 pt-2">
              <Skeleton variant="rectangular" className="h-24 w-full rounded-xl" />
              <div className="flex justify-end">
                <Skeleton variant="rectangular" className="h-9 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;