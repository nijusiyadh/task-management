import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/features/common/constants';
import type { WorkspaceRole } from '@/core/domain/workspace/workspace.type';
import {
   inviteMember,
   updateMemberRole,
   removeMember,
} from '../api/member.api';

function useInviteMember(workspaceId: string, workspaceSlug: string) {
   const client = useQueryClient();

   return useMutation({
      mutationFn: (data: { email: string; role: 'ADMIN' | 'MEMBER' }) =>
         inviteMember(workspaceId, data),
      onSuccess: async () => {
         await Promise.all([
            client.invalidateQueries({
               queryKey: QUERY_KEYS.members.all(workspaceId),
            }),
            client.invalidateQueries({
               queryKey: QUERY_KEYS.workspaces.details(workspaceId),
            }),
            client.invalidateQueries({
               queryKey: QUERY_KEYS.workspaces.bySlug(workspaceSlug),
            }),
         ]);
      },
   });
}

function useUpdateMemberRole(workspaceId: string) {
   const client = useQueryClient();

   return useMutation({
      mutationFn: ({
         userId,
         role,
      }: {
         userId: string;
         role: Exclude<WorkspaceRole, 'OWNER'>;
      }) => updateMemberRole(workspaceId, userId, role),
      onSuccess: async () => {
         await client.invalidateQueries({
            queryKey: QUERY_KEYS.members.all(workspaceId),
         });
      },
   });
}

function useRemoveMember(workspaceId: string, workspaceSlug: string) {
   const client = useQueryClient();

   return useMutation({
      mutationFn: (userId: string) => removeMember(workspaceId, userId),
      onSuccess: async () => {
         await Promise.all([
            client.invalidateQueries({
               queryKey: QUERY_KEYS.members.all(workspaceId),
            }),
            client.invalidateQueries({
               queryKey: QUERY_KEYS.workspaces.details(workspaceId),
            }),
            client.invalidateQueries({
               queryKey: QUERY_KEYS.workspaces.bySlug(workspaceSlug),
            }),
         ]);
      },
   });
}

export { useInviteMember, useUpdateMemberRole, useRemoveMember };
