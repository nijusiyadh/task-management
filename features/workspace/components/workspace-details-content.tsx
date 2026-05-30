'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, FolderKanban, Plus, Users } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateProjectDialog } from '@/features/project/components/create-project-dialog';
import { ProjectCard } from '@/features/project/components/project-card';
import { useWorkspaceProjects } from '@/features/project/hooks/use-project';
import type { Project } from '@/core/domain/project/project.type';
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
         <Link
            href={ROUTES.workspaceMembers(workspace.slug).path}
            className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground">
            <Users className="size-3.5" />
            <span>
               {workspace.memberCount}{' '}
               {workspace.memberCount === 1 ? 'member' : 'members'}
            </span>
         </Link>
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

interface ProjectsListProps {
   isPending: boolean;
   isError: boolean;
   projects: Project[] | undefined;
   workspaceId: string;
   workspaceSlug: string;
   canManage: boolean;
   canDelete: boolean;
   onCreateClick: () => void;
}

function ProjectsList({
   isPending,
   isError,
   projects,
   workspaceId,
   workspaceSlug,
   canManage,
   canDelete,
   onCreateClick,
}: ProjectsListProps) {
   if (isPending) {
      return (
         <div className="grid gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
               <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
         </div>
      );
   }

   if (isError) {
      return (
         <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>Failed to load projects. Please refresh the page.</span>
         </div>
      );
   }

   if (projects && projects.length > 0) {
      return (
         <div className="grid gap-2">
            {projects.map((project) => (
               <ProjectCard
                  key={project.id}
                  project={project}
                  workspaceId={workspaceId}
                  workspaceSlug={workspaceSlug}
                  canManage={canManage}
                  canDelete={canDelete}
               />
            ))}
         </div>
      );
   }

   return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-14 text-center">
         <div className="flex size-11 items-center justify-center rounded-full bg-muted">
            <FolderKanban className="size-5 text-muted-foreground" />
         </div>
         <div>
            <p className="font-medium">No projects yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
               {canManage
                  ? 'Create your first project to start tracking work.'
                  : 'No projects have been created in this workspace yet.'}
            </p>
         </div>
         {canManage && (
            <Button variant="outline" size="sm" onClick={onCreateClick}>
               <Plus />
               New project
            </Button>
         )}
      </div>
   );
}

function ProjectsSection() {
   const { workspace } = useWorkspaceContext();
   const canManage = workspace.role === 'OWNER' || workspace.role === 'ADMIN';
   const canDelete = workspace.role === 'OWNER' || workspace.role === 'ADMIN';
   const [createOpen, setCreateOpen] = useState(false);

   const {
      data: projects,
      isPending,
      isError,
   } = useWorkspaceProjects(workspace.id);

   return (
      <>
         <div className="grid gap-4">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="font-medium">Projects</h2>
                  <p className="text-sm text-muted-foreground">
                     All projects in this workspace
                  </p>
               </div>
               {canManage && (
                  <Button size="sm" onClick={() => setCreateOpen(true)}>
                     <Plus />
                     New project
                  </Button>
               )}
            </div>

            <ProjectsList
               isPending={isPending}
               isError={isError}
               projects={projects}
               workspaceId={workspace.id}
               workspaceSlug={workspace.slug}
               canManage={canManage}
               canDelete={canDelete}
               onCreateClick={() => setCreateOpen(true)}
            />
         </div>

         <CreateProjectDialog
            workspaceId={workspace.id}
            workspaceSlug={workspace.slug}
            open={createOpen}
            onOpenChange={setCreateOpen}
         />
      </>
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
