import React from 'react';
import { Skeleton } from '@/libraries/components/Skeleton';
import { range } from '@/utils/helpers';

const Loading: React.FC = () => {
  const tableRows = range(6);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-right font-sans">
          <thead>
            <tr className="border-b border-border bg-background/60 font-heading text-xs font-semibold text-muted">
              <th className="px-5 py-4">العميل</th>
              <th className="px-5 py-4">البريد الإلكتروني</th>
              <th className="px-5 py-4">المدينة</th>
              <th className="px-5 py-4">الميزانية</th>
              <th className="px-5 py-4 text-left"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border text-sm text-text">
            {tableRows.map((_, idx) => (
              <tr key={`skeleton-row-${idx}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circular" className="h-10 w-10 shrink-0 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton variant="text" className="h-4 w-28" />
                      <Skeleton variant="text" className="h-3 w-20" />
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <Skeleton variant="text" className="h-4 w-36" />
                </td>

                <td className="px-5 py-4">
                  <Skeleton variant="text" className="h-4 w-20" />
                </td>

                <td className="px-5 py-4">
                  <Skeleton variant="text" className="h-4 w-24" />
                </td>

                <td className="px-5 py-4 text-left">
                  <div className="flex items-center justify-end gap-1">
                    <Skeleton variant="circular" className="h-8 w-8 rounded-lg" />
                    <Skeleton variant="circular" className="h-8 w-8 rounded-lg" />
                    <Skeleton variant="circular" className="h-8 w-8 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border bg-background/60 px-4 py-3">
        <Skeleton variant="rectangular" className="h-[20px] w-8 rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton variant="rectangular" className="h-[15px] w-[20px] rounded-lg" />
          <Skeleton variant="rectangular" className="h-[15px] w-[20px] rounded-lg" />
          <Skeleton variant="rectangular" className="h-[15px] w-[20px] rounded-lg" />
        </div>
        <Skeleton variant="rectangular" className="h-[15px] w-8 rounded-lg" />
      </div>
    </div>
  );
};

export default Loading;