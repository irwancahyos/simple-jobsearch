
import { useParams } from 'next/navigation';
import Image from 'next/image';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';


// ********** Local interface **********
interface NavbarProps {
  title?: string;
  candidatePage?: boolean;
  userDetail?: string;
}

const Navbar = ({title, userDetail, candidatePage = false}: NavbarProps) => {

  const params = useParams();
  const isJobIdExist = Boolean(params?.id);
  
  return (
    <nav className="w-full shadow-md flex justify-center fixed z-50 bg-white top-0 px-5">
      <div className={cn("flex items-center justify-between py-1 w-full min-h-14 max-w-[1400px]", candidatePage && 'xl:px-[100px]')}>
        {isJobIdExist ? (
          <div className="flex items-center gap-[8px]">
            {!candidatePage && (
              <button className="px-[1rem] py-[4px] rounded-[8px] border border-[#E0E0E0] shadow font-bold text-[0.875rem] text-[#1D1F20] cursor-pointer hover:bg-[#f5f5f5]">
                Job list
              </button>
            )}
            <div>
              <ChevronRight className="w-[24px] h-[24px]" />
            </div>
            <button className="px-[1rem] py-[4px] rounded-[8px] border border-[#C2C2C2] font-bold text-[0.875rem] text-[#1D1F20] bg-[#EDEDED]">
              Manage Candidate
            </button>
          </div>
        ) : (
          <span className="text-[14px] md:text-[18px] font-bold">{title}</span>
        )}
        <HoverCard openDelay={10}>
          <HoverCardTrigger>
            <button className="w-[35px] h-[35px] rounded-full overflow-hidden border-2 focus:outline-none cursor-pointer">
              <Image src="https://picsum.photos/200" width={200} height={200} alt="Profile picture" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit mr-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-x-2">
                <div className="w-[35px] h-[35px] rounded-full overflow-hidden border-2 focus:outline-none cursor-pointer">
                  <Image src="https://picsum.photos/200" width={200} height={200} alt="Profile picture" />
                </div>
                <div className="flex flex-col">
                  <strong className="text-[14px]">Irwan Cahyo Saputro</strong>
                  <span className="text-[rgb(117,117,117)] text-[14px]">hahha@gmail.com</span>
                </div>
              </div>
              <hr className="border border-[rgb(224,224,224)]" />
              <button className="text-left text-red-500 hover:text-red-700 duration-300 flex items-center gap-x-2 cursor-pointer ml-1 w-fit text-[14px]">
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </nav>
  );
}

export default Navbar;