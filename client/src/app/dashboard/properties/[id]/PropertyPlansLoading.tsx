import React from "react";
import { Skeleton } from "@/libraries/components/Skeleton";

const PropertyPlansLoading: React.FC = () => {
  const skeletonPlans = Array.from({ length: 2 });

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <Skeleton variant="text" className="mb-4 h-6 w-28" />

      <div className="sm:space-y-2 sm:block flex items-center gap-2">
        {skeletonPlans.map((_, idx) => (
          <Skeleton
            key={`skeleton-plan-${idx}`}
            variant="rectangular"
            className="h-28 w-full rounded-xl"
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyPlansLoading;