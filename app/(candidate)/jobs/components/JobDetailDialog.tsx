"use client"

import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { JobsData } from "@/app/models/adminModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import jobsCardImage from '../../../../asset/image/rakamin-logo-square.png';
import { cn } from "@/lib/utils";

// ********** Local Interface **********
interface JobDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedJob: JobsData | null;
}

// ********** Main Component **********
const JobDetailDialog = ({
  isOpen,
  onOpenChange,
  selectedJob
}: JobDetailDialogProps) => {

  const router = useRouter();
  const jobTypeMap: Record<string, string> = {
    'full-time': 'Full-time',
    contract: 'Contract',
    'part-time': 'Part-time',
    internship: 'Internship',
    freelance: 'Freelance',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-[450px]:max-w-[90vw] max-w-[600px] p-0 gap-0 [&>button[data-slot=dialog-close]:not([data-custom-close])]:hidden">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-[24px] py-[1rem] border-b border-b-[#E0E0E0]">
          <DialogTitle className="text-[1rem] text-[#1D1F20] font-semibold">
            Job Detail
          </DialogTitle>
          <DialogClose asChild data-custom-close>
            <button
              type="button"
              className="opacity-70 transition-opacity hover:opacity-100 focus:outline-none cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>

        {/* Content */}
        <div className="p-[24px] flex flex-col gap-[0.5rem] max-h-[60vh] overflow-y-auto">
          {/* Job Info */}
          <div className="flex justify-between gap-[24px]">
            <div className="flex gap-[1rem] justify-between">
              <div className="w-fit">
                <Image
                  alt="Jobs card image"
                  src={jobsCardImage?.src}
                  height={200}
                  width={200}
                  className="w-[3rem] h-[3rem] rounded-[4px] border border-[#E0E0E0]"
                />
              </div>
              <div className="flex-1 flex flex-col gap-[4px]">
                <h2 className="text-[1rem] text-[#404040] font-semibold">{selectedJob?.title}</h2>
                <div className="flex items-center gap-1">
                  <span className="text-[#757575] text-[0.75rem]">PT Template</span>
                  <span>{`-`}</span>
                  {selectedJob?.job_type && (
                  <div className="bg-[#43936C] rounded-[3px] py-[1px] px-[6px] text-white text-[0.563rem] font-semibold w-fit">
                    <span>{jobTypeMap[selectedJob?.job_type]}</span>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border border-[#E0E0E0] border-dashed inset-0" />

          {/* Description */}
          <div className="text-[#404040] text-[0.875rem] mt-2 leading-relaxed whitespace-pre-line">
            {selectedJob?.description}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-[24px] flex justify-end border-t border-t-[#E0E0E0]">
          <button
            onClick={() => router.push(`/apply/${selectedJob?.id}`)}
            className={cn(
              "bg-[#FBC037] hover:bg-[#f3b627] cursor-pointer py-[6px] px-[20px] rounded-[8px] text-[#404040] shadow font-semibold text-[0.875rem]"
            )}
          >
            Apply
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailDialog;
