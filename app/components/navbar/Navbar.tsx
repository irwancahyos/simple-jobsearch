'use client'

import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import { LogOut } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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
  const [isGuest, setIsGuest] = useState(false);

  const params = useParams();
  const searchParams = useSearchParams();
  const isJobIdExist = Boolean(params?.id);
  const jobTitle = searchParams.get('title') || 'Job';

  useEffect(() => {
    setIsGuest(candidatePage && !Cookies.get('role'));
  }, [candidatePage]);

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
            <Breadcrumb className="min-w-0">
              <BreadcrumbList className="flex-nowrap text-[0.875rem]">
                {!candidatePage && (
                  <>
                    <BreadcrumbItem className="shrink-0">
                      <BreadcrumbLink asChild>
                        <Link href="/dashboard" className="font-bold text-[#1D1F20] hover:text-[#01959F]">
                          Job List
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                )}
                <BreadcrumbItem className="min-w-0">
                  <span className="truncate font-medium text-[#757575]">{jobTitle}</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="shrink-0">
                  <BreadcrumbPage className="font-bold text-[#1D1F20]">Manage Candidates</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          ) : (
            <span className="text-[14px] md:text-[18px] font-bold">{title}</span>
          )}
          {isGuest ? (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-3 py-1.5 text-sm font-semibold text-[#404040] hover:text-[#01959F]">
                Login
              </Link>
              <Link href="/register" className="rounded-[8px] bg-[#FBC037] px-[16px] py-[4px] text-[0.875rem] font-semibold text-[#404040] shadow hover:bg-[#f3b627]">
                Register
              </Link>
            </div>
          ) : (
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
          )}
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