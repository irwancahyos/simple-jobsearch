'use client'

import InputText from '@/app/components/input/InputText';
import addNewJobImage from '../../../asset/image/image-add-job.jpg';
import emptyJobListImage from '../../../asset/image/image-no-job.png';
import { Search, Plus } from 'lucide-react';
import { JobListCard } from './JobListCard';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import { AddJobDialog } from './components/AddJobDialog';
import { useState } from 'react';

const AdminDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="flex-1 flex gap-7 max-w-[1400px] overflow-y-scroll h-screen px-1">
      <div className="flex-1 flex flex-col gap-[1rem] bg-white">
        <InputText
          placeholder="Search by job details"
          suffix={<Search className="text-[#01959F]" size={24} />}
          className="relative flex items-center rounded-[8px] border-2 border-[#EDEDED] bg-white text-[#757575] focus-within:border-[#01959F] duration-300 text-[0.875rem] min-h-11"
        />
        {/* <div className="space-y-2 pb-2"> */} {/* when job is exist */}
        <div className="flex w-full h-full justify-center items-center">
          {' '}
          {/* when no job exist */}
          {/* <JobListCard />
          <JobListCard />
          <JobListCard />
          <JobListCard />
          <JobListCard />
          <JobListCard />
          <JobListCard /> */}
          <div className="flex flex-col items-center gap-4">
            <Image src={emptyJobListImage?.src} width={200} height={200} alt="empty job list image" className={''} />
            <div className="flex flex-col gap-3 items-center">
              <div className="flex gap-1 flex-col items-center">
                <p className="text-[#404040] font-bold text-[1rem] sm:text-[1.25rem]">No job openings available</p>
                <p className="text-[#404040] text-[0.75rem] sm:text-[1rem]">Create a job opening now and start the candidate process.</p>
              </div>
              <div>
                <button
                  onClick={() => setOpenDialog(!openDialog)}
                  className="px-[1rem] py-[6px] rounded-[8px] text-[#404040] text-[1rem] font-bold bg-[#FBC037] hover:bg-[#f5b621] cursor-pointer  shadow"
                >
                  Create a new job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[300px] hidden lg:block">
        <div
          className="relative rounded-2xl w-full bg-cover bg-no-repeat p-6 overflow-hidden flex flex-col gap-6"
          style={{ backgroundImage: `url(${addNewJobImage?.src})` }}
        >
          <div className="absolute inset-0 bg-black/72 z-10" />
          <div className="relative z-30 flex flex-col gap-1">
            <span className="text-[18px] font-bold text-[#E0E0E0]">Recruit the best candidates</span>
            <span className="text-[14px] font-bold text-white">Create jobs, invite, and hire with ease</span>
          </div>
          <button
            onClick={() => setOpenDialog(!openDialog)}
            className="bg-[#01959F] group/button-add cursor-pointer overflow-hidden relative z-30 text-white text-[1rem] font-bold py-1.5 px-4 rounded-[6px] w-full"
          >
            <div className="absolute inset-0 bg-black/20 opacity-0 z-10 group-hover/button-add:opacity-100 transition-opacity duration-200" />
            <span className="relative z-20">Create new job</span>
          </button>
        </div>
      </div>
      <Tooltip>
        <TooltipTrigger
          onClick={() => setOpenDialog(!openDialog)}
          className="fixed bottom-5 right-5 w-10 h-10 rounded-full flex items-center justify-center shadow bg-(--secondary-color) text-white cursor-pointer hover:bg-[#037881] lg:hidden"
        >
          <Plus size={16} />
        </TooltipTrigger>
        <TooltipContent>
          <p>Create new job</p>
        </TooltipContent>
      </Tooltip>
      <AddJobDialog isOpen={openDialog} onOpenChange={setOpenDialog} />
    </div>
  );
} 

export default AdminDashboard;