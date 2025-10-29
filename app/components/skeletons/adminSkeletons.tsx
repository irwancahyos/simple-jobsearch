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

const ManageJobSkeleton = () => {
  return (
    <div className="w-full flex min-h-[86vh] max-w-[1400px] m-auto">
      <div className="flex flex-col gap-6 flex-1 overflow-x-hidden">
        <div className="h-[28px] w-[200px]">
          <Skeleton className="h-full w-full rounded-md" />
        </div>

        <div className="border border-[#E0E0E0] rounded-lg p-6 flex flex-col gap-4">
          <div className="hidden sm:grid grid-cols-7 gap-4 mb-2">
            {['Full Name', 'Email', 'Phone', 'Domicile', 'Gender', 'LinkedIn', 'Status'].map((header) => (
              <Skeleton key={header} className="h-5 w-full rounded-md" />
            ))}
          </div>

          {[...Array(2)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
              {Array(7)
                .fill(null)
                .map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-5 w-full rounded-md" />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { JobListCardSkeleton, ManageJobSkeleton };
