"use client"

import { Skeleton } from "@/components/ui/skeleton";

const JobListCardSkeleton = () => {
  return (
    <div className="p-6 rounded-xl shadow-lg flex flex-col gap-3 bg-white border border-gray-100">
      <div className="flex gap-4 animate-pulse">
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-28 rounded-md" />
      </div>

      <div className="flex flex-col gap-3 mt-1 animate-pulse">
        <Skeleton className="h-6 w-3/4 rounded-lg" />

        <div className="flex justify-between items-start flex-col sm:flex-row gap-y-2 pt-2">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-10 w-full sm:w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export { JobListCardSkeleton };
