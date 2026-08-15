import React from 'react';
import { Skeleton } from '@/libraries/components/Skeleton';

const Loading: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative h-72 w-full bg-background">
          <Skeleton variant="rectangular" className="h-full w-full" />

          <div className="absolute bottom-0 right-0 p-6 space-y-2.5 w-full max-w-md">
            <Skeleton variant="rectangular" className="h-6 w-20 rounded-md" />
            <Skeleton variant="text" className="h-8 w-3/4" />
            <Skeleton variant="text" className="h-4 w-1/2" />
          </div>

          <div className="absolute left-4 top-4">
            <Skeleton variant="rectangular" className="h-10 w-10 rounded-xl" />
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Skeleton variant="text" className="h-7 w-32" />

            <div className="flex flex-wrap gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={`feature-skeleton-${idx}`} className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Skeleton variant="circular" className="h-4 w-4 shrink-0" />
                    <Skeleton variant="text" className="h-5 w-12" />
                  </div>
                  <Skeleton variant="text" className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex border-b border-border px-5 py-4 gap-6">
              <Skeleton variant="text" className="h-5 w-20" />
              <Skeleton variant="text" className="h-5 w-20" />
            </div>

            <div className="p-6 space-y-4">
              <Skeleton variant="text" className="h-4 w-full" />
              <Skeleton variant="text" className="h-4 w-5/6" />
              <Skeleton variant="text" className="h-4 w-2/3" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <Skeleton variant="text" className="mb-4 h-6 w-28" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton
                  key={`gallery-skeleton-${idx}`}
                  variant="rectangular"
                  className="h-28 w-full rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <Skeleton variant="text" className="h-5 w-28" />

            <div className="flex items-center gap-3">
              <Skeleton variant="circular" className="h-12 w-12 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton variant="text" className="h-4 w-32" />
                <Skeleton variant="text" className="h-3 w-20" />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Skeleton variant="rectangular" className="h-8 w-8 rounded-md shrink-0" />
              <Skeleton variant="text" className="h-4 w-36" />
            </div>

            <Skeleton variant="rectangular" className="mt-4 h-10 w-full rounded-xl" />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <Skeleton variant="text" className="h-5 w-28" />

            <Skeleton variant="rectangular" className="h-45 w-full rounded-md shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;