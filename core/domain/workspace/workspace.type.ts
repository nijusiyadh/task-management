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

type WorkspaceWithRole = Workspace & {
   role: WorkspaceRole;
   memberCount: number;
   projectCount: number;
};

type WorkspaceMemberUser = {
   id: string;
   name: string;
   email: string;
   image: string | null;
};

type WorkspaceMemberWithUser = WorkspaceMember & {
   user: WorkspaceMemberUser;
};

export type {
   WorkspaceRole,
   Workspace,
   WorkspaceMember,
   WorkspaceMemberUser,
   WorkspaceMemberWithUser,
   WorkspaceWithRole,
};
