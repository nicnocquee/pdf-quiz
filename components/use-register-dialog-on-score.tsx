import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const useRegisterDialogOnScore = (isSubmitted: boolean) => {
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (isSubmitted) {
      const checkAuth = async () => {
        const supabase = createClient();
        const {
          data: { user }
        } = await supabase.auth.getUser();
        setShowRegisterDialog(!user);
        setCheckingAuth(false);
      };
      checkAuth();
    } else {
      setShowRegisterDialog(false);
      setCheckingAuth(true);
    }
  }, [isSubmitted]);

  return { showRegisterDialog, setShowRegisterDialog, checkingAuth };
};

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lng: string;
}

export function RegisterDialog({
  open,
  onOpenChange,
  lng
}: RegisterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl">🎉</span>
            <DialogTitle className="text-2xl font-bold text-center">
              Join us to unlock more fun!
            </DialogTitle>
            <p className="text-base text-muted-foreground text-center max-w-xs">
              Register for a free account to get{" "}
              <span className="font-semibold text-primary">
                more quiz questions
              </span>{" "}
              and make your quiz{" "}
              <span className="font-semibold text-primary">
                public &amp; shareable
              </span>
              !
            </p>
          </div>
        </DialogHeader>
        <ul className="list-none flex flex-col gap-2 my-4 text-base text-center">
          <li className="flex items-center gap-2 justify-center">
            <span className="text-lg">➕</span> More questions per quiz
          </li>
          <li className="flex items-center gap-2 justify-center">
            <span className="text-lg">🌐</span> Make your quiz public &amp;
            shareable
          </li>
        </ul>
        <DialogFooter className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-col items-center justify-center gap-3 mt-4 w-full">
            <Link href={`/${lng}/register`} className="w-full">
              <Button className="w-full text-lg py-6">
                Create free account
              </Button>
            </Link>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?
            </div>
            <Link href={`/${lng}/login`} className="w-full">
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
