import { httpClient } from '@/infrastructure/client-container';
import type {
   WorkspaceMemberWithUser,
   WorkspaceRole,
} from '@/core/domain/workspace/workspace.type';

async function getWorkspaceMembers(
   workspaceId: string
): Promise<WorkspaceMemberWithUser[]> {
   return httpClient.get(`/workspaces/${workspaceId}/members`);
}

async function inviteMember(
   workspaceId: string,
   data: { email: string; role: 'ADMIN' | 'MEMBER' }
): Promise<WorkspaceMemberWithUser> {
   return httpClient.post(`/workspaces/${workspaceId}/members`, data);
}

async function updateMemberRole(
   workspaceId: string,
   userId: string,
   role: Exclude<WorkspaceRole, 'OWNER'>
): Promise<WorkspaceMemberWithUser> {
   return httpClient.patch(`/workspaces/${workspaceId}/members/${userId}`, {
      role,
   });
}

async function removeMember(
   workspaceId: string,
   userId: string
): Promise<void> {
   return httpClient.delete(`/workspaces/${workspaceId}/members/${userId}`);
}

export { getWorkspaceMembers, inviteMember, updateMemberRole, removeMember };
