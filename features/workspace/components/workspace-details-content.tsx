'use client';

import { useState } from 'react';
import { FolderKanban, Plus, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { relativeTime } from '@/utils/date';
import { useWorkspaceContext } from '../context/workspace-context';
import { EditWorkspaceDialog } from './edit-workspace-dialog';
import { RoleBadge } from './role-badge';

function WorkspaceHeader() {
   const { workspace } = useWorkspaceContext();
   const [editOpen, setEditOpen] = useState(false);

   const canEdit = workspace.role === 'OWNER' || workspace.role === 'ADMIN';

   return (
      <>
         <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
               <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                  {workspace.name.charAt(0).toUpperCase()}
               </div>
               <div>
                  <div className="flex items-center gap-2">
                     <h1 className="text-xl font-semibold tracking-tight">
                        {workspace.name}
                     </h1>
                     <RoleBadge role={workspace.role} />
                  </div>
                  {workspace.description && (
                     <p className="mt-0.5 text-sm text-muted-foreground">
                        {workspace.description}
                     </p>
                  )}
               </div>
            </div>

            {canEdit && (
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditOpen(true)}>
                  Edit
               </Button>
            )}
         </div>

         <EditWorkspaceDialog
            workspaceId={workspace.id}
            workspaceSlug={workspace.slug}
            currentName={workspace.name}
            currentDescription={workspace.description}
            open={editOpen}
            onOpenChange={setEditOpen}
         />
      </>
   );
}

function WorkspaceStats() {
   const { workspace } = useWorkspaceContext();

   return (
      <div className="flex flex-wrap gap-3">
         <div className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-sm text-muted-foreground">
            <Users className="size-3.5" />
            <span>
               {workspace.memberCount}{' '}
               {workspace.memberCount === 1 ? 'member' : 'members'}
            </span>
         </div>
         <div className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-sm text-muted-foreground">
            <FolderKanban className="size-3.5" />
            <span>
               {workspace.projectCount}{' '}
               {workspace.projectCount === 1 ? 'project' : 'projects'}
            </span>
         </div>
         <div className="rounded-lg border bg-card px-3 py-1.5 text-sm text-muted-foreground">
            Created {relativeTime(workspace.createdAt)}
         </div>
      </div>
   );
}

function ProjectsSection() {
   const { workspace } = useWorkspaceContext();
   const canCreate = workspace.role === 'OWNER' || workspace.role === 'ADMIN';

   return (
      <div className="grid gap-4">
         <div className="flex items-center justify-between">
            <div>
               <h2 className="font-medium">Projects</h2>
               <p className="text-sm text-muted-foreground">
                  All projects in this workspace
               </p>
            </div>
            {canCreate && (
               <Button size="sm">
                  <Plus />
                  New project
               </Button>
            )}
         </div>

         {/* TODO: replace with real project list once projects feature is built */}
         <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-14 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-muted">
               <FolderKanban className="size-5 text-muted-foreground" />
            </div>
            <div>
               <p className="font-medium">No projects yet</p>
               <p className="mt-1 text-sm text-muted-foreground">
                  {canCreate
                     ? 'Create your first project to start tracking work.'
                     : 'No projects have been created in this workspace yet.'}
               </p>
            </div>
            {canCreate && (
               <Button variant="outline" size="sm">
                  <Plus />
                  New project
               </Button>
            )}
         </div>
      </div>
   );
}

export function WorkspaceDetailsContent() {
   return (
      <section className="grid gap-6">
         <WorkspaceHeader />
         <WorkspaceStats />
         <ProjectsSection />
      </section>
   );
}
