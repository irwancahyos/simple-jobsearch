'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { EllipsisVertical } from 'lucide-react';

import { JobsData } from '@/app/models/adminModel';
import { cn, formatRupiah } from '@/lib/utils';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';

interface JobListCardProps {
  onJobCreated?: () => void;
  jobData: JobsData;
}

export const JobListCard = ({jobData, onJobCreated}: JobListCardProps) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions: ('active' | 'inactive' | 'draft')[] = ['active', 'inactive', 'draft'];

  const handleChangeStatus = async () => {
    if (!selectedStatus) return;

    setIsUpdating(true);
    try {
      // update ke supabase
      const { data, error } = await supabase
        .from("jobs")
        .update({
          status: selectedStatus,
          list_card: {
            ...jobData.list_card,
            badge: selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1),
          },
        })
        .eq("id", jobData.id)
        .select();

      if (error) {
        toast.error("Failed to update status");
      } else {
        toast.success("Success Update Status of Job!");
        onJobCreated?.();
        setIsDialogOpen(false);
      }
    } catch (err) {
      toast.error("Error:" + err);
    }
    setIsUpdating(false);
  };

  const badgeClassMap: Record<string, string> = {
    active: 'border-[#B8DBCA] bg-[#F8FBF9] text-[#43936C]',
    inactive: 'border-[#F5B1B7] bg-[#FFFAFA] text-[#E11428]',
    draft: 'border-[#FEEABC] bg-[#FFFCF5] text-[#FBC037]',
  };

  const dropdownStatusColorMap: Record<string, string> = {
    active: "text-[#43936C]",
    inactive: "text-[#E11428]",
    draft: "text-[#FBC037]",
  }

  return (
    <div className="p-[24px] rounded-[1rem] shadow-md flex flex-col gap-[12px]">
      <div className="flex gap-[1rem]">
        <div
          className={cn('px-[1rem] py-[4px] border-[1px] rounded-[8px] h-fit text-[0.875rem] font-bold', badgeClassMap[jobData?.status])}
        >
          {jobData?.list_card?.badge}
        </div>
        <div className="px-[1rem] py-[4px] border border-[#E0E0E0] h-fit text-[0.875rem] rounded-[4px] text-[#404040]">
          {jobData.list_card?.started_on_text}
        </div>
      </div>
      <div className="flex flex-col gap-[12px]">
        <div>
          <span className="text-[1.125rem] font-bold text-[#1D1F20]">{jobData?.title}</span>
        </div>
        <div className="flex justify-between sm:items-center flex-col sm:flex-row gap-y-2">
          <span className="text-[#616161] text-[1rem]">{`${formatRupiah(jobData?.salary_range?.min)} - ${formatRupiah(
            jobData?.salary_range?.max,
          )}`}</span>

          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/dashboard/manage/${jobData?.id}?title=${encodeURIComponent(jobData?.title ?? '')}`)}
              className="py-2 px-[1rem] bg-[#01959F] w-full above-450:w-fit above-450:self-end text-white text-[0.75rem] font-bold cursor-pointer rounded-[8px] shadow hover:bg-[#02828b] duration-300"
            >
              {jobData?.list_card?.cta}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm cursor-pointer font-bold hover:opacity-55 flex focus-visible:border-0! items-center justify-center">
                <EllipsisVertical size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {statusOptions.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    className={cn(dropdownStatusColorMap[status], 'cursor-pointer')}
                    onClick={() => {
                      setSelectedStatus(status);
                      setIsDialogOpen(true);
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Status Change</DialogTitle>
                </DialogHeader>
                <div className="py-4 text-sm text-gray-700">Are you sure you want to change status to "{selectedStatus}"?</div>
                <DialogFooter className="flex gap-2 justify-end">
                  <DialogClose className="px-3 py-1 border cursor-pointer rounded bg-gray-100">Cancel</DialogClose>
                  <button
                    onClick={handleChangeStatus}
                    disabled={isUpdating}
                    className="px-3 py-1 bg-[#01959F] cursor-pointer text-white rounded hover:bg-[#02828b] duration-300"
                  >
                    {isUpdating ? 'Updating...' : 'Confirm'}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};
