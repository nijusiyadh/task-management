type RouteEntry = { path: string };
type DynamicRouteEntry = (slug: string) => RouteEntry;
type Route = Record<string, RouteEntry | DynamicRouteEntry>;

export const ROUTES = {
   // auth
   login: { path: '/login' },
   register: { path: '/register' },

   // main
   home: { path: '/' },
   projects: { path: '/projects' },
   members: { path: '/members' },
   settings: { path: '/settings' },

   // workspace
   workspace: (slug: string) => ({ path: `/workspaces/${slug}` }),
   workspaceSettings: (slug: string) => ({
      path: `/workspaces/${slug}/settings`,
   }),
} satisfies Route;

export const PROTECTED_ROUTES: string[] = [
   ROUTES.home.path,
   ROUTES.projects.path,
   ROUTES.members.path,
   ROUTES.settings.path,
];
