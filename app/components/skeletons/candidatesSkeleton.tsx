"use client"

import { Skeleton } from "@/components/ui/skeleton";

const JobCardSkeleton = () => {
  return (
    <div className="border border-[#E0E0E0] p-[24px] rounded-[8px] flex flex-col gap-[8px]">
      {/* ********** Header ********** */}
      <div className="flex gap-[1rem] items-center">
        <Skeleton className="w-[3rem] h-[3rem] rounded-[4px]" />
        <div className="flex flex-col gap-[6px] flex-1">
          <Skeleton className="h-[1rem] w-[60%]" />
          <Skeleton className="h-[0.75rem] w-[40%]" />
        </div>
      </div>

      <div className="border-b border-b-[#E0E0E0] w-full border-dashed inset-0" />

      {/* ********** Location & Salary ********** */}
      <div className="flex flex-col gap-[8px]">
        <div className="flex gap-[4px] items-center">
          <Skeleton className="w-[1rem] h-[1rem] rounded-full" />
          <Skeleton className="h-[0.75rem] w-[40%]" />
        </div>
        <div className="flex gap-[4px] items-center">
          <Skeleton className="w-[1rem] h-[1rem] rounded-full" />
          <Skeleton className="h-[0.75rem] w-[50%]" />
        </div>
      </div>
    </div>
  )
}

const JobDetailSkeleton = () => {
  return (
    <div className="p-[24px] h-full flex gap-[24px] flex-col">
      {/* ********** Header ********** */}
      <div className="flex justify-between gap-[24px]">
        <div className="flex gap-[24px] justify-between flex-1">
          {/* ********** Company Logo ********** */}
          <Skeleton className="w-[3rem] h-[3rem] rounded-[4px]" />

          {/* ********** Job Info ********** */}
          <div className="flex-1 flex flex-col gap-[8px]">
            <Skeleton className="w-[4rem] h-[1rem] rounded-[4px]" /> 
            <Skeleton className="w-[60%] h-[1.25rem]" /> 
            <Skeleton className="w-[40%] h-[0.875rem]" /> 
          </div>
        </div>

        {/* ********** Apply Button ********** */}
        <Skeleton className="w-[5rem] h-[2rem] rounded-[8px]" />
      </div>

      {/* ********** Divider ********** */}
      <Skeleton className="w-full h-[1px]" />

      {/* ********** Description ********** */}
      <div className="flex flex-col gap-[12px]">
        <Skeleton className="h-[0.875rem] w-[95%]" />
        <Skeleton className="h-[0.875rem] w-[90%]" />
        <Skeleton className="h-[0.875rem] w-[85%]" />
        <Skeleton className="h-[0.875rem] w-[80%]" />
        <Skeleton className="h-[0.875rem] w-[92%]" />
        <Skeleton className="h-[0.875rem] w-[88%]" />
      </div>
    </div>
  )
}

const ApplyPageSkeleton = () => {
  return (
    <div className="bg-white sm:border sm:border-[#E0E0E0] sm:shadow w-full flex flex-col gap-6 h-screen sm:h-[800px] sm:max-w-[600px] md:max-w-[700px] max-[450px]:py-10 max-[450px]:px-5 p-10">
      {/* ********** Header ********** */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-[1.75rem] h-[1.75rem] rounded-md" />
        <div className="flex-1 flex justify-between items-center">
          <Skeleton className="h-6 w-1/2 rounded" />
          <Skeleton className="h-4 w-6 rounded" />
        </div>
      </div>

      {/* ********** Form ********** */}
      <div className="md:px-6 space-y-4 overflow-y-auto flex-1">
        {/* ********** Photo Profile ********** */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-1/3 rounded" />
          <Skeleton className="w-32 h-32 rounded-full" />
          <Skeleton className="w-24 h-10 rounded" />
        </div>

        {/* ********** Input Fields ********** */}
        {Array(7)
          .fill(0)
          .map((_, idx) => (
            <div key={idx} className="space-y-2">
              <Skeleton className="h-4 w-1/3 rounded" />
              <Skeleton className="h-10 rounded" />
            </div>
          ))}

        {/* ********** Radio Group ********** */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3 rounded" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-24 rounded" />
            <Skeleton className="h-10 w-24 rounded" />
          </div>
        </div>
      </div>

      {/* ********** Footer ********** */}
      <Skeleton className="h-10 w-full rounded" />
    </div>
  );
}

export { JobCardSkeleton, JobDetailSkeleton, ApplyPageSkeleton };