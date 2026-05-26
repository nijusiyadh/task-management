type RouteEntry = { path: string };
type Route = Record<string, RouteEntry>;

export const ROUTES = {
   // auth
   login: { path: '/login' },
   register: { path: '/register' },

   // main
   home: { path: '/' },
   projects: { path: '/projects' },
   members: { path: '/members' },
   settings: { path: '/settings' },
} satisfies Route;

export const PROTECTED_ROUTES: string[] = [
   ROUTES.home.path,
   ROUTES.projects.path,
   ROUTES.members.path,
   ROUTES.settings.path,
];
