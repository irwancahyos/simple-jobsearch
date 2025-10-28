import { JobsData } from "@/app/models/adminModel";
import { cn, formatRupiah } from "@/lib/utils";

export const JobListCard = (jobData: JobsData) => {

  const badgeClassMap: Record<string, string> = {
    "active": "border-[#B8DBCA] bg-[#F8FBF9] text-[#43936C]",
    "inactive": "border-[#F5B1B7] bg-[#FFFAFA] text-[#E11428]",
    "draft": "border-[#FEEABC] bg-[#FFFCF5] text-[#FBC037]",
  }
  return (
    <div className="p-[24px] rounded-[1rem] shadow-md flex flex-col gap-[12px]">
      <div className="flex gap-[1rem]">
        <div className={cn('px-[1rem] py-[4px] border-[1px] rounded-[8px] text-[0.875rem] font-bold', badgeClassMap[jobData?.status])}>
          {jobData?.list_card?.badge}
        </div>
        <div className="px-[1rem] py-[4px] border border-[#E0E0E0] rounded-[4px] text-[#404040]">{jobData.list_card?.started_on_text}</div>
      </div>
      <div className="flex flex-col gap-[12px]">
        <div>
          <span className="text-[1.125rem] font-bold text-[#1D1F20]">{jobData?.title}</span>
        </div>
        <div className="flex justify-between sm:items-center flex-col sm:flex-row gap-y-2">
          <span className="text-[#616161] text-[1rem]">{`${formatRupiah(jobData?.salary_range?.min)} - ${formatRupiah(jobData?.salary_range?.max)}`}</span>
          <button className="py-2 px-[1rem] bg-[#01959F] w-full above-450:w-fit above-450:self-end text-white text-[0.75rem] font-bold cursor-pointer rounded-[8px] shadow hover:bg-[#02828b] duration-300">
            {jobData?.list_card?.cta}
          </button>
        </div>
      </div>
    </div>
  );
};