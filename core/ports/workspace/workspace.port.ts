import {
   Workspace,
   WorkspaceMember,
   WorkspaceRole,
   WorkspaceWithRole,
} from '@/core/domain/workspace/workspace.type';

interface IWorkspacePort {
   /** Creates a new workspace owned by the given user */
   createWorkspace(data: {
      name: string;
      slug: string;
      description?: string;
      ownerId: string;
   }): Promise<Workspace>;

   /** Finds a workspace by its ID, returns null if not found */
   getWorkspaceById(id: string): Promise<Workspace | null>;

   /** Finds a workspace by its unique slug with member/project counts, returns null if not found */
   getWorkspaceBySlug(
      slug: string
   ): Promise<
      (Workspace & { memberCount: number; projectCount: number }) | null
   >;

   /** Returns all workspaces the user is a member of, with their role in each */
   getUserWorkspaces(userId: string): Promise<WorkspaceWithRole[]>;

   /** Updates workspace name or description */
   updateWorkspace(
      id: string,
      data: Partial<Pick<Workspace, 'name' | 'description'>>
   ): Promise<Workspace>;

   /** Permanently deletes a workspace and all its projects and tasks */
   deleteWorkspace(id: string): Promise<void>;

   /** Adds a user to a workspace with the given role */
   addMember(data: {
      workspaceId: string;
      userId: string;
      role: WorkspaceRole;
   }): Promise<WorkspaceMember>;

   /** Removes a user from a workspace */
   removeMember(workspaceId: string, userId: string): Promise<void>;

   /** Returns a single membership record, or null if the user is not a member */
   getMember(
      workspaceId: string,
      userId: string
   ): Promise<WorkspaceMember | null>;

   /** Returns all members of a workspace */
   getMembers(workspaceId: string): Promise<WorkspaceMember[]>;

   /** Updates the role of an existing workspace member */
   updateMemberRole(data: {
      workspaceId: string;
      userId: string;
      role: WorkspaceRole;
   }): Promise<WorkspaceMember>;
}

export type { IWorkspacePort };
