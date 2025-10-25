
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import Image from 'next/image'
import { LogOut } from 'lucide-react';

// Local interface
interface NavbarProps {
  title: string;
  userDetail?: string;
}

const Navbar = ({title = "Job List", userDetail}: NavbarProps) => {
  return (
    <nav className="w-full shadow-md flex justify-center fixed z-50 bg-white top-0 px-5">
      <div className='flex items-center justify-between py-1 w-full min-h-14 max-w-[1400px]'>
        <span className="text-[14px] md:text-[18px] font-bold">{title}</span>
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

// 1,440px

export default Navbar;