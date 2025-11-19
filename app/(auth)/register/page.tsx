'use client';

import Link from "next/link";

const JoinAsComponent = () => {
  return (
    <div className="w-full bg-[#FFFFFF] shadow flex p-[20px] md:p-[40px]">
      <div className="w-full flex flex-col gap-3">
        {/* ********** Header ********** */}
        <div className="flex flex-col gap-[8px]">
          <h1 className="text-[#404040] text-[1.25rem] font-semibold">Join with Optiiion</h1>
          <p className="text-[0.875rem] font-normal text-[#404040]">
            Already have an account?{' '}
            <Link className="underline text-(--secondary-color)" href={'/login'}>
              Login
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-[8px]">
          <p className="text-[0.875rem] font-normal text-[#404040]">Register As ?</p>
        </div>

        {/* ********** Content ********** */}
        <div className="flex flex-col gap-[8px]">
          <Link href={'/register/recruter'} className="w-full">
            <button className="px-[1rem] py-[6px] w-full flex cursor-pointer justify-center items-center rounded-[8px] shadow bg-[#FBC037] hover:bg-[#f6b92b] text-[#404040] font-semibold">
              Recruiter
            </button>
          </Link>
          <div className="flex w-full gap-[12px] items-center">
            <hr className="border-b border-b-[#9E9E9E] border-x-0 border-y-0 flex-1" />
            <span className="text-[0.75rem] text-[#9E9E9E] w-fit">atau</span>
            <hr className="border-b border-b-[#9E9E9E] border-x-0 border-y-0 flex-1" />
          </div>
          <Link href={'/register/candidate'} className="w-full">
            <button className="px-[1rem] py-[6px] w-full flex cursor-pointer justify-center items-center rounded-[8px] shadow bg-[#FBC037] hover:bg-[#f6b92b] text-[#404040] font-semibold">
              Job Seekers
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JoinAsComponent;
