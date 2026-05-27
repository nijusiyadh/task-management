export const QUERY_KEY = {
   workspaces: 'workspaces',
};

export const QUERY_KEYS = {
   workspaces: {
      all: [QUERY_KEY.workspaces] as const,
      details: (id: string) => [QUERY_KEY.workspaces, id] as const,
      bySlug: (slug: string) => [QUERY_KEY.workspaces, 'slug', slug] as const,
   },
};
