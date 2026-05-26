'use client';
import { Bell } from 'lucide-react';

import { UserMenu } from './user-menu';
import { useAuth } from '@/features/auth/context';

export function Header() {
   const { session } = useAuth();

   if (!session) return null;

   return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="mx-auto flex h-14 w-full max-w-360 items-center gap-4 px-6">
            {/* TODO: Replace with actual app logo */}
            <div className="flex items-center gap-2 font-semibold text-foreground">
               <span className="text-primary text-lg">⬡</span>
               <span className="font-urbanist tracking-tight">Taskly</span>
            </div>

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
