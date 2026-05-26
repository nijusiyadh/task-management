'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
   ExternalLink,
   MoreHorizontal,
   Pencil,
   Settings,
   Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/constants/routes';
import { DeleteWorkspaceDialog } from './delete-workspace-dialog';
import { RenameWorkspaceDialog } from './rename-workspace-dialog';

interface WorkspaceActionsMenuProps {
   workspaceId: string;
   workspaceName: string;
   workspaceSlug: string;
}

export function WorkspaceActionsMenu({
   workspaceId,
   workspaceName,
   workspaceSlug,
}: WorkspaceActionsMenuProps) {
   const router = useRouter();
   const [renameOpen, setRenameOpen] = useState(false);
   const [deleteOpen, setDeleteOpen] = useState(false);

   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger
               render={
                  <Button variant="ghost" size="icon" className="shrink-0" />
               }
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
                  <DropdownMenuItem
                     onClick={(e) => {
                        e.stopPropagation();
                        setRenameOpen(true);
                     }}>
                     <Pencil />
                     Rename
                  </DropdownMenuItem>
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
               </DropdownMenuGroup>
               <DropdownMenuSeparator />
               <DropdownMenuGroup>
                  <DropdownMenuItem
                     variant="destructive"
                     className="font-urbanist"
                     onClick={(e) => {
                        e.stopPropagation();
                        setDeleteOpen(true);
                     }}>
                     <Trash2 />
                     Delete
                  </DropdownMenuItem>
               </DropdownMenuGroup>
            </DropdownMenuContent>
         </DropdownMenu>

         <RenameWorkspaceDialog
            workspaceId={workspaceId}
            currentName={workspaceName}
            open={renameOpen}
            onOpenChange={setRenameOpen}
         />

         <DeleteWorkspaceDialog
            workspaceId={workspaceId}
            workspaceName={workspaceName}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
         />
      </>
   );
}
