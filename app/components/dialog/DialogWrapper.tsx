import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ReactNode } from "react";

interface DialogWrapperProps {
  openDialog: boolean;
  setOpenDialog?: (open: boolean) => void;
  children: ReactNode;
}

const DialogWrapper = ({openDialog, setOpenDialog, children}: DialogWrapperProps) => {
  return (
    <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog?.(open)}>
      <DialogContent autoFocus={false} aria-label="user-profile" className="p-0 overflow-hidden [&>[data-slot='dialog-close']]:hidden border-none">
        {children}
      </DialogContent>
    </Dialog>
  );
} 

export default DialogWrapper;