'use client';

import { Bell } from 'lucide-react';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/features/auth/context';

import { UserMenu } from './user-menu';

export function Header() {
   const { session } = useAuth();

   if (!session) return null;

   return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
         <div className="flex h-14 w-full items-center gap-2 px-3">
            <SidebarTrigger className="hover:cursor-pointer" />

            <div className="ml-auto flex items-center gap-2">
               {/* TODO: wire up notifications */}
               <button className="flex hover:cursor-pointer size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Bell className="size-4" />
               </button>

               <UserMenu name={session.user.name} email={session.user.email} />
            </div>
         </div>
      </header>
   );
}
