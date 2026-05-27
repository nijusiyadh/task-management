'use client';

import { FolderKanban } from 'lucide-react';
import type { Project } from '@/core/domain/project/project.type';
import { relativeTime } from '@/utils/date';
import { ProjectActionsMenu } from './project-actions-menu';

interface ProjectCardProps {
   project: Project;
   workspaceId: string;
   workspaceSlug: string;
   canManage: boolean;
   canDelete: boolean;
}

export function ProjectCard({
   project,
   workspaceId,
   workspaceSlug,
   canManage,
   canDelete,
}: ProjectCardProps) {
   return (
      <div className="group flex cursor-pointer items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-accent/50">
         <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
            <FolderKanban className="size-4" />
         </div>

         <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{project.name}</p>
            {project.description && (
               <p className="truncate text-xs text-muted-foreground">
                  {project.description}
               </p>
            )}
         </div>

         <span className="shrink-0 text-xs text-muted-foreground">
            {relativeTime(project.createdAt)}
         </span>

         {canManage && (
            <ProjectActionsMenu
               workspaceId={workspaceId}
               workspaceSlug={workspaceSlug}
               projectId={project.id}
               projectName={project.name}
               canDelete={canDelete}
            />
         )}
      </div>
   );
}
