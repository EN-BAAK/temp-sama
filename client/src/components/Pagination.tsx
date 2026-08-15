'use client';

import React from 'react';
import { ChevronRight, ChevronLeft, MoreHorizontal } from 'lucide-react';
import { PaginationProps } from '@/types/components';
import Button from '@/libraries/forms/components/Button';
import { cn } from '@/utils/tools';

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, hasPreviousPage = currentPage > 1, hasNextPage = currentPage < totalPages, isDisabled = false, className }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={cn(
      "flex flex-wrap items-center justify-end gap-4",
      className
    )}>
      <div className="flex items-center gap-1.5" dir="ltr">
        <Button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage || isDisabled}
          aria-label="Previous page"
          icon={ChevronLeft}
          variant="transparent-primary"
          iconClassName="w-4 h-4"
        />

        {getPageNumbers().map((item, index) => {
          if (item === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center font-sans text-xs text-muted"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const pageNum = item as number;
          const isActive = pageNum === currentPage;

          return (
            <Button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => onPageChange(pageNum)}
              disabled={isDisabled}
              className="text-xs rounded-sm"
              variant={isActive ? 'primary' : 'transparent-primary'}
              label={String(pageNum)}
            />
          );
        })}

        <Button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || isDisabled}
          aria-label="Next page"
          icon={ChevronRight}
          variant="transparent-primary"
          iconClassName="w-4 h-4"
        />
      </div>
    </div>
  );
};

export default Pagination;