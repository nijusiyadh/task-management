'use client';

import { useRouter } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import type { Workspace } from '@/core/domain/workspace/workspace.type';
import { WorkspaceActionsMenu } from './workspace-actions-menu';

function getWorkspaceHref(slug: string) {
   return ROUTES.workspace(slug).path;
}

interface WorkspaceListItemProps {
   workspace: Workspace;
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
            <p className="truncate font-medium">{workspace.name}</p>
            <p className="truncate text-xs text-muted-foreground">
               /{workspace.slug}
            </p>
         </div>

         {workspace.description && (
            <p className="hidden max-w-xs truncate text-sm text-muted-foreground md:block">
               {workspace.description}
            </p>
         )}

         <div onClick={(e) => e.stopPropagation()}>
            <WorkspaceActionsMenu
               workspaceId={workspace.id}
               workspaceName={workspace.name}
               workspaceSlug={workspace.slug}
            />
         </div>
      </div>
   );
}
