'use client'

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import Cookies from 'js-cookie'
import { ChevronRight, LogOut } from 'lucide-react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/app/store/userStore';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import personIcon from '@/asset/image/icon-person.png';

import DialogWrapper from '../dialog/DialogWrapper';
import Profile from '../profile/Profile';

// ********** Local interface **********
interface NavbarProps {
  title?: string;
  candidatePage?: boolean;
  userDetail?: string;
}

// ********** Main Component **********
const Navbar = ({title, userDetail, candidatePage = false}: NavbarProps) => {

  const { profile, clearProfile } = useUserStore();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  const params = useParams();
  const router = useRouter()
  const isJobIdExist = Boolean(params?.id);

  const handleLogout = () => {
    Cookies.remove('role');
    clearProfile();
    window.location.href = '/login';
  };

  const handleOpenProfileDialog = () => {
    setOpenProfileDialog(!openProfileDialog);
  }
  
  return (
    <>
      <nav className="w-full shadow-md flex justify-center fixed z-50 bg-white top-0 px-5">
        <div className={cn('flex items-center justify-between py-1 w-full min-h-14 max-w-[1400px]', candidatePage && 'xl:px-[100px]')}>
          {isJobIdExist ? (
            <div className="flex items-center gap-[8px]">
              {!candidatePage && (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="md:px-[1rem] md:py-[4px] md:rounded-[8px] md:border md:border-[#E0E0E0] md:shadow font-bold text-[0.875rem] text-[#1D1F20] cursor-pointer hover:bg-[#f5f5f5]"
                >
                  Job list
                </button>
              )}
              <div>
                <ChevronRight className="w-[1rem] h-[1rem] md:w-[24px] md:h-[24px]" />
              </div>
              <button className="md:px-[1rem] md:py-[4px] md:rounded-[8px] md:border md:border-[#C2C2C2] font-bold text-[0.875rem] text-[#1D1F20] md:bg-[#EDEDED]">
                Manage Candidate
              </button>
            </div>
          ) : (
            <span className="text-[14px] md:text-[18px] font-bold">{title}</span>
          )}
          <HoverCard openDelay={10}>
            <HoverCardTrigger>
              <button className="w-[35px] h-[35px] p-2 rounded-full overflow-hidden border-2 focus:outline-none cursor-pointer">
                <Image src={personIcon?.src} width={200} height={200} alt="Profile picture" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit mr-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-x-2">
                  <div className="w-[35px] h-[35px] p-2 rounded-full overflow-hidden border-2 focus:outline-none cursor-pointer">
                    <Image onClick={handleOpenProfileDialog} src={personIcon?.src} width={200} height={200} alt="Profile picture" />
                  </div>
                  <div className="flex flex-col">
                    <strong className="text-[14px]">{profile?.email?.split('@')[0]}</strong>
                    <span className="text-[rgb(117,117,117)] text-[14px]">{profile?.email}</span>
                  </div>
                </div>
                <hr className="border border-[rgb(224,224,224)]" />
                <button
                  onClick={() => setOpenLogoutDialog(true)}
                  className="text-left text-red-500 hover:text-red-700 duration-300 flex items-center gap-x-2 cursor-pointer ml-1 w-fit text-[14px]"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </nav>

      {/* ********** Logout Confirmation Dialog ********** */}
      <Dialog open={openLogoutDialog} onOpenChange={(open) => setOpenLogoutDialog(open)}>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>Logout Confirmation</DialogTitle>
          </DialogHeader>
          <p>Exit the platform ?</p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button className="cursor-pointer" variant="outline" onClick={() => setOpenLogoutDialog(false)}>
              No
            </Button>
            <Button className="cursor-pointer bg-(--error-color) hover:bg-(--error-color)/80" onClick={handleLogout}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DialogWrapper openDialog={openProfileDialog} setOpenDialog={setOpenProfileDialog}>
        <Profile />
      </DialogWrapper>
    </>
  );
}

export default Navbar;