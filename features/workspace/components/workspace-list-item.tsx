'use client';

import { useRouter } from 'next/navigation';
import { FolderKanban, Users } from 'lucide-react';

import { relativeTime } from '@/utils/date';

import { ROUTES } from '@/constants/routes';
import type { WorkspaceWithRole } from '@/core/domain/workspace/workspace.type';
import { RoleBadge } from './role-badge';
import { WorkspaceActionsMenu } from './workspace-actions-menu';

function getWorkspaceHref(slug: string) {
   return ROUTES.workspace(slug).path;
}

interface WorkspaceListItemProps {
   workspace: WorkspaceWithRole;
}

function WorkspaceAvatar({ name }: { name: string }) {
   return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
         {name.charAt(0).toUpperCase()}
      </div>
   );
}

export function WorkspaceListItem({ workspace }: WorkspaceListItemProps) {
   const router = useRouter();
   const href = getWorkspaceHref(workspace.slug);

   return (
      <div
         role="button"
         tabIndex={0}
         onClick={() => router.push(href)}
         onKeyDown={(e) => e.key === 'Enter' && router.push(href)}
         className="group flex cursor-pointer items-center gap-4 rounded-lg border bg-card px-4 py-3 text-card-foreground transition-colors hover:bg-accent/50">
         <WorkspaceAvatar name={workspace.name} />

         <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
               <p className="truncate font-medium">{workspace.name}</p>
               <RoleBadge role={workspace.role} />
            </div>
            <p className="truncate text-xs text-muted-foreground">
               /{workspace.slug}
            </p>
         </div>

         <div className="hidden shrink-0 items-center gap-4 text-xs text-muted-foreground sm:flex">
            <span
               className="flex items-center gap-1"
               aria-label={`${workspace.memberCount} ${workspace.memberCount === 1 ? 'member' : 'members'}`}>
               <Users className="size-3.5" aria-hidden />
               {workspace.memberCount}
            </span>
            <span
               className="flex items-center gap-1"
               aria-label={`${workspace.projectCount} ${workspace.projectCount === 1 ? 'project' : 'projects'}`}>
               <FolderKanban className="size-3.5" aria-hidden />
               {workspace.projectCount}
            </span>
            <span aria-label={`Created ${relativeTime(workspace.createdAt)}`}>
               {relativeTime(workspace.createdAt)}
            </span>
         </div>

         {workspace.role !== 'MEMBER' && (
            <WorkspaceActionsMenu
               workspaceSlug={workspace.slug}
               role={workspace.role}
            />
         )}
      </div>
   );
}
