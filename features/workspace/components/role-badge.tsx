import type { WorkspaceRole } from '@/core/domain/workspace/workspace.type';

const ROLE_LABEL: Record<WorkspaceRole, string> = {
   OWNER: 'Owner',
   ADMIN: 'Admin',
   MEMBER: 'Member',
};

const ROLE_STYLE: Record<WorkspaceRole, string> = {
   OWNER: 'bg-primary/10 text-primary',
   ADMIN: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
   MEMBER: 'bg-muted text-muted-foreground',
};

export function RoleBadge({ role }: { role: WorkspaceRole }) {
   return (
      <span
         className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${ROLE_STYLE[role]}`}>
         {ROLE_LABEL[role]}
      </span>
   );
}
