export const QUERY_KEY = {
   workspaces: 'workspaces',
   projects: 'projects',
   members: 'members',
};

export const QUERY_KEYS = {
   workspaces: {
      all: [QUERY_KEY.workspaces] as const,
      details: (id: string) => [QUERY_KEY.workspaces, id] as const,
      bySlug: (slug: string) => [QUERY_KEY.workspaces, 'slug', slug] as const,
   },
   projects: {
      all: (workspaceId: string) => [QUERY_KEY.projects, workspaceId] as const,
      details: (workspaceId: string, projectId: string) =>
         [QUERY_KEY.projects, workspaceId, projectId] as const,
   },
   members: {
      all: (workspaceId: string) => [QUERY_KEY.members, workspaceId] as const,
   },
};
