type Project = {
   id: string;
   name: string;
   description: string | null;
   workspaceId: string;
   createdAt: Date;
   updatedAt: Date;
};

type Label = {
   id: string;
   name: string;
   color: string;
   projectId: string;
   createdAt: Date;
   updatedAt: Date;
};

export type { Project, Label };
