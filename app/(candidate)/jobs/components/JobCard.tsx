'use client'

import Image from "next/image";
import { Banknote, MapPin } from "lucide-react";

import jobsCardImage from '@/asset/image/main-logo-platform.png';
import { JobsData } from "@/app/models/adminModel";
import { cn, formatRupiah } from "@/lib/utils";

// ********** Local interface **********
interface JobCardProps {
  jobData: JobsData;
  selectedJobId: string;
}

// ********** Main Component **********
const JobCard = ({jobData, selectedJobId}: JobCardProps) => {
  return (
    <div
      className={cn(
        'border border-[#E0E0E0] p-[24px] rounded-[8px] cursor-pointer transition-all duration-300 flex flex-col gap-[8px]',
        selectedJobId === jobData?.id && 'border-2 border-[#01777F] bg-[#F7FEFF]',
      )}
    >
      {/* ********** Head Content ********** */}
      <div className="flex gap-[1rem] items-center">
        <div>
          <Image
            alt="Jobs card image"
            src={jobsCardImage?.src}
            height={200}
            width={200}
            className="w-[3rem] h-[3rem] rounded-[4px] border border-[#E0E0E0]"
          />
        </div>
        <div>
          <h2 className="font-semibold text-[1rem] text-[#404040]">{jobData?.title}</h2>
          <span className="text-[0.875rem] text-[#404040]">PT Template</span>
        </div>
      </div>

      {/* ********** Sparator ********** */}
      <div className="border-b border-b-[#E0E0E0] w-full border-dashed inset-0" />

      {/* ********** Content ********** */}
      <div className="flex flex-col gap-[8px]">
        <div className="flex gap-[4px] items-center">
          <MapPin className="w-[1rem] h-[1rem] text-[#616161]" />
          <h3 className="font-medium text-[0.75rem] text-[#616161]">Template</h3>
        </div>
        <div className="flex gap-[4px] items-center">
          <Banknote className="w-[1rem] h-[1rem] text-[#616161]" />
          <p className="text-[0.75rem] text-[#616161]">{`${formatRupiah(jobData?.salary_range?.min)} - ${formatRupiah(
            jobData?.salary_range?.max,
          )}`}</p>
        </div>
      </div>
    </div>
  );
}

export default JobCard;