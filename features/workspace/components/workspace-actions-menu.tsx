'use client';

import { useRouter } from 'next/navigation';
import { ExternalLink, MoreHorizontal, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/constants/routes';
import type { WorkspaceRole } from '@/core/domain/workspace/workspace.type';

interface WorkspaceActionsMenuProps {
   workspaceSlug: string;
   role: WorkspaceRole;
}

export function WorkspaceActionsMenu({
   workspaceSlug,
   role,
}: WorkspaceActionsMenuProps) {
   const router = useRouter();
   const canAccessSettings = role === 'OWNER' || role === 'ADMIN';

   return (
      <DropdownMenu>
         <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" className="shrink-0" />}
            onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal />
            <span className="sr-only">Actions</span>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" side="bottom">
            <DropdownMenuGroup className="font-urbanist">
               <DropdownMenuItem
                  onClick={(e) => {
                     e.stopPropagation();
                     router.push(ROUTES.workspace(workspaceSlug).path);
                  }}>
                  <ExternalLink />
                  Open
               </DropdownMenuItem>
               {canAccessSettings && (
                  <DropdownMenuItem
                     onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                           ROUTES.workspaceSettings(workspaceSlug).path
                        );
                     }}>
                     <Settings />
                     Settings
                  </DropdownMenuItem>
               )}
            </DropdownMenuGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
