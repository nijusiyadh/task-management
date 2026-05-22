type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER';

type Workspace = {
   id: string;
   slug: string;
   name: string;
   description: string | null;
   ownerId: string;
   createdAt: Date;
   updatedAt: Date;
};

type WorkspaceMember = {
   id: string;
   workspaceId: string;
   userId: string;
   role: WorkspaceRole;
   joinedAt: Date;
   createdAt: Date;
   updatedAt: Date;
};

export type { WorkspaceRole, Workspace, WorkspaceMember };
