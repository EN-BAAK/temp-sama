import { Skeleton } from '@/libraries/components/Skeleton';
import { range } from '@/utils/helpers';
import { MapPin } from 'lucide-react';
import React from 'react'

const Loading: React.FC = () => {
  const skeletonGov = range(6);
  const skeletonCity = range(4);

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {skeletonGov.map(g =>
        <div
          key={`skelton-${g}`}
          className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>

            <div className='space-y-1'>
              <Skeleton variant="text" className='w-30 h-5' />
              <Skeleton variant="text" className='w-15 h-5' />
            </div>
          </div>

          <div className="flex items-center mt-8 gap-2">
            {skeletonCity.map(c =>
              <Skeleton variant='circular' className='w-15 h-6' key={`skelton-c-${c}`} />
            )}
          </div>

        </div>)}
    </div>
  )
}

export default Loading