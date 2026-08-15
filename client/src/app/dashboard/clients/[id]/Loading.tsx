import React from 'react';
import { Skeleton } from '@/libraries/components/Skeleton';

const Loading: React.FC = () => {
  const contactRows = Array.from({ length: 4 });
  const contentCards = Array.from({ length: 2 });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-xl border border-border bg-reversed p-6 shadow-sm">
        <div className="mb-5 flex flex-col items-center">
          <Skeleton variant="circular" className="h-15 w-15 rounded-full" />
          <Skeleton variant="text" className="mt-3 h-5 w-36" />
        </div>

        <div className="space-y-3 font-sans">
          {contactRows.map((_, idx) => (
            <div key={`skeleton-contact-${idx}`} className="flex items-center gap-3">
              <Skeleton variant="circular" className="h-2 w-8 shrink-0 rounded-lg" />
              <Skeleton variant="text" className="h-4 w-32" />
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton variant="rectangular" className="h-[50px] w-full rounded-xl" />
          <Skeleton variant="rectangular" className="h-[50px] w-full rounded-xl" />
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="overflow-hidden rounded-xl border border-border bg-reversed shadow-sm">
          <div className="flex border-b border-border p-2 gap-3">
            <Skeleton variant="rectangular" className="h-[80px] w-32 rounded-lg" />
            <Skeleton variant="rectangular" className="ml-2 h-[80px] w-24 rounded-lg" />
          </div>

          <div className="space-y-4 p-6">
            {contentCards.map((_, idx) => (
              <div
                key={`skeleton-tab-card-${idx}`}
                className="rounded-lg border border-border p-4 space-y-3"
              >
                <Skeleton variant="text" className="h-5 w-1/3" />
                <Skeleton variant="text" className="h-4 w-3/4" />
                <Skeleton variant="text" className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;