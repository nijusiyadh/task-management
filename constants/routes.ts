type RouteEntry = { path: string };
type DynamicRouteEntry = (slug: string) => RouteEntry;
type Route = Record<string, RouteEntry | DynamicRouteEntry>;

export const ROUTES = {
   // auth
   login: { path: '/login' },
   register: { path: '/register' },

   // main
   workspaces: { path: '/workspaces' },
   projects: { path: '/projects' },
   members: { path: '/members' },
   settings: { path: '/settings' },

   // workspace
   workspace: (slug: string) => ({ path: `/workspaces/${slug}` }),
   workspaceMembers: (slug: string) => ({
      path: `/workspaces/${slug}/members`,
   }),
   workspaceSettings: (slug: string) => ({
      path: `/workspaces/${slug}/settings`,
   }),
} satisfies Route;

export const PROTECTED_ROUTES: string[] = [
   ROUTES.workspaces.path,
   ROUTES.projects.path,
   ROUTES.members.path,
   ROUTES.settings.path,
];
