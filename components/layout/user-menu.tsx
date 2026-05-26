'use client';

import { LogOut, Settings, User, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/constants/routes';
import { signOut } from '@/infrastructure/auth/better-auth/client';

interface UserMenuProps {
   name: string;
   email: string;
}

interface MenuItemProps {
   label: string;
   icon: LucideIcon;
   onClick?: () => void;
   variant?: 'default' | 'destructive';
}

function MenuItem({
   label,
   icon: Icon,
   onClick,
   variant = 'default',
}: MenuItemProps) {
   return (
      <DropdownMenuItem
         variant={variant}
         className="hover:cursor-pointer"
         onClick={onClick}>
         <Icon className="mr-2 size-4" />
         {label}
      </DropdownMenuItem>
   );
}

function getInitials(name: string) {
   return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
}

export function UserMenu({ name, email }: UserMenuProps) {
   const [confirmOpen, setConfirmOpen] = useState(false);

   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
               <Avatar className="size-8 cursor-pointer">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                     {getInitials(name)}
                  </AvatarFallback>
               </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
               <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                     <span className="font-medium">{name}</span>
                     <span className="text-xs font-normal text-muted-foreground truncate">
                        {email}
                     </span>
                  </DropdownMenuLabel>
               </DropdownMenuGroup>
               <DropdownMenuSeparator />

               <MenuItem label="Profile" icon={User} onClick={() => {}} />

               <MenuItem label="Settings" icon={Settings} onClick={() => {}} />

               <DropdownMenuSeparator />

               <MenuItem
                  label="Sign out"
                  icon={LogOut}
                  variant="destructive"
                  onClick={() => setConfirmOpen(true)}
               />
            </DropdownMenuContent>
         </DropdownMenu>

         <SignOutConfirmationModal
            isOpen={confirmOpen}
            closeModal={() => setConfirmOpen(false)}
         />
      </>
   );
}

interface SignOutConfirmationModalProps {
   isOpen?: boolean;
   closeModal: () => void;
}

function SignOutConfirmationModal({
   isOpen = false,
   closeModal,
}: SignOutConfirmationModalProps) {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);

   const handleSignOut = async () => {
      setIsLoading(true);
      await signOut();
      router.replace(ROUTES.login.path);
   };

   return (
      <Dialog
         open={isOpen}
         onOpenChange={closeModal}
         disablePointerDismissal={isLoading}>
         <DialogContent className="font-urbanist">
            <DialogHeader>
               <DialogTitle className="font-urbanist">Sign out</DialogTitle>
               <DialogDescription>
                  Are you sure you want to sign out?
               </DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <Button
                  variant="outline"
                  disabled={isLoading}
                  onClick={closeModal}
                  className="hover:cursor-pointer">
                  Cancel
               </Button>
               <Button
                  variant="destructive"
                  loading={isLoading}
                  className="hover:cursor-pointer"
                  onClick={handleSignOut}>
                  Sign out
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
