'use client';

import { useState } from 'react';
import {
   AlertCircle,
   MoreHorizontal,
   Plus,
   Shield,
   Trash2,
   UserRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { WorkspaceMemberWithUser } from '@/core/domain/workspace/workspace.type';
import { useAuth } from '@/features/auth/context';
import { useWorkspaceContext } from '../context/workspace-context';
import { useWorkspaceMembers } from '../hooks/use-members';
import {
   useRemoveMember,
   useUpdateMemberRole,
} from '../hooks/use-member-mutations';
import { InviteMemberDialog } from './invite-member-dialog';
import { RoleBadge } from './role-badge';

function MemberAvatar({ name, image }: { name: string; image: string | null }) {
   if (image) {
      return (
         <img
            src={image}
            alt={name}
            className="size-9 rounded-full object-cover"
         />
      );
   }
   return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
         {name.charAt(0).toUpperCase()}
      </div>
   );
}

interface MemberActionsProps {
   member: WorkspaceMemberWithUser;
   workspaceId: string;
   workspaceSlug: string;
   currentUserId: string;
   isOwner: boolean;
}

function MemberActions({
   member,
   workspaceId,
   workspaceSlug,
   currentUserId,
   isOwner,
}: MemberActionsProps) {
   const { mutate: updateRole } = useUpdateMemberRole(workspaceId);
   const { mutate: remove } = useRemoveMember(workspaceId, workspaceSlug);

   const isSelf = member.userId === currentUserId;
   const isTargetOwner = member.role === 'OWNER';

   if (!isOwner || isTargetOwner) return null;

   function handleRoleChange(role: 'ADMIN' | 'MEMBER') {
      updateRole(
         { userId: member.userId, role },
         {
            onSuccess: () => toast.success('Role updated'),
            onError: () => toast.error('Failed to update role'),
         }
      );
   }

   function handleRemove() {
      remove(member.userId, {
         onSuccess: () => toast.success('Member removed'),
         onError: () => toast.error('Failed to remove member'),
      });
   }

   return (
      <DropdownMenu>
         <DropdownMenuTrigger
            render={
               <Button variant="ghost" size="icon" className="shrink-0" />
            }>
            <MoreHorizontal />
            <span className="sr-only">Member actions</span>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DropdownMenuGroup className="font-urbanist">
               {member.role !== 'ADMIN' && (
                  <DropdownMenuItem onClick={() => handleRoleChange('ADMIN')}>
                     <Shield />
                     Make admin
                  </DropdownMenuItem>
               )}
               {member.role !== 'MEMBER' && (
                  <DropdownMenuItem onClick={() => handleRoleChange('MEMBER')}>
                     <UserRound />
                     Make member
                  </DropdownMenuItem>
               )}
            </DropdownMenuGroup>
            {!isSelf && (
               <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem
                        variant="destructive"
                        className="font-urbanist"
                        onClick={handleRemove}>
                        <Trash2 />
                        Remove
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
               </>
            )}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}

interface MembersListProps {
   isPending: boolean;
   isError: boolean;
   members: WorkspaceMemberWithUser[] | undefined;
   workspaceId: string;
   workspaceSlug: string;
   currentUserId: string;
   isOwner: boolean;
}

function MembersList({
   isPending,
   isError,
   members,
   workspaceId,
   workspaceSlug,
   currentUserId,
   isOwner,
}: MembersListProps) {
   if (isPending) {
      return (
         <div className="grid gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
               <Skeleton key={i} className="h-[60px] w-full rounded-lg" />
            ))}
         </div>
      );
   }

   if (isError) {
      return (
         <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>Failed to load members. Please refresh the page.</span>
         </div>
      );
   }

   if (!members || members.length === 0) return null;

   return (
      <div className="grid gap-2">
         {members.map((member) => (
            <div
               key={member.id}
               className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3">
               <MemberAvatar
                  name={member.user.name}
                  image={member.user.image}
               />

               <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                     <p className="truncate font-medium">{member.user.name}</p>
                     <RoleBadge role={member.role} />
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                     {member.user.email}
                  </p>
               </div>

               <MemberActions
                  member={member}
                  workspaceId={workspaceId}
                  workspaceSlug={workspaceSlug}
                  currentUserId={currentUserId}
                  isOwner={isOwner}
               />
            </div>
         ))}
      </div>
   );
}

export function WorkspaceMembersContent() {
   const { workspace } = useWorkspaceContext();
   const { session } = useAuth();
   const [inviteOpen, setInviteOpen] = useState(false);

   const isOwner = workspace.role === 'OWNER';
   const canInvite = workspace.role === 'OWNER' || workspace.role === 'ADMIN';

   const {
      data: members,
      isPending,
      isError,
   } = useWorkspaceMembers(workspace.id);

   return (
      <>
         <section className="grid gap-6">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-xl font-semibold tracking-tight">
                     Members
                  </h1>
                  <p className="text-sm text-muted-foreground">
                     {workspace.memberCount}{' '}
                     {workspace.memberCount === 1 ? 'member' : 'members'} in
                     this workspace
                  </p>
               </div>
               {canInvite && (
                  <Button size="sm" onClick={() => setInviteOpen(true)}>
                     <Plus />
                     Invite member
                  </Button>
               )}
            </div>

            <MembersList
               isPending={isPending}
               isError={isError}
               members={members}
               workspaceId={workspace.id}
               workspaceSlug={workspace.slug}
               currentUserId={session?.userId ?? ''}
               isOwner={isOwner}
            />
         </section>

         <InviteMemberDialog
            workspaceId={workspace.id}
            workspaceSlug={workspace.slug}
            open={inviteOpen}
            onOpenChange={setInviteOpen}
         />
      </>
   );
}
