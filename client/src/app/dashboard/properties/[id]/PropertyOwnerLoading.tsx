import React from 'react';
import { Skeleton } from '@/libraries/components/Skeleton';

const Loading: React.FC = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm font-sans">
      <Skeleton variant="text" className="mb-4 h-5 w-28" />

      <div className="mb-4 flex items-center gap-3">
        <Skeleton variant="circular" className="h-12 w-12 shrink-0" />
        <div className="space-y-2">
          <Skeleton variant="text" className="h-4 w-32" />
          <Skeleton variant="text" className="h-3 w-20" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Skeleton variant="rectangular" className="h-8 w-8 rounded-lg shrink-0" />
        <Skeleton variant="text" className="h-4 w-28" />
      </div>

      <Skeleton variant="rectangular" className="mt-4 h-10 w-full rounded-xl" />
    </div>
  );
};

export default Loading;