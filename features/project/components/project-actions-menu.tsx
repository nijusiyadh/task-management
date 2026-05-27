'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteProjectDialog } from './delete-project-dialog';
import { RenameProjectDialog } from './rename-project-dialog';

interface ProjectActionsMenuProps {
   workspaceId: string;
   workspaceSlug: string;
   projectId: string;
   projectName: string;
   canDelete: boolean;
}

export function ProjectActionsMenu({
   workspaceId,
   workspaceSlug,
   projectId,
   projectName,
   canDelete,
}: ProjectActionsMenuProps) {
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
               <span className="sr-only">Project actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom">
               <DropdownMenuGroup className="font-urbanist">
                  <DropdownMenuItem
                     onClick={(e) => {
                        e.stopPropagation();
                        setRenameOpen(true);
                     }}>
                     <Pencil />
                     Rename
                  </DropdownMenuItem>
               </DropdownMenuGroup>
               {canDelete && (
                  <>
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
                  </>
               )}
            </DropdownMenuContent>
         </DropdownMenu>

         <RenameProjectDialog
            workspaceId={workspaceId}
            projectId={projectId}
            currentName={projectName}
            open={renameOpen}
            onOpenChange={setRenameOpen}
         />

         <DeleteProjectDialog
            workspaceId={workspaceId}
            workspaceSlug={workspaceSlug}
            projectId={projectId}
            projectName={projectName}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
         />
      </>
   );
}
