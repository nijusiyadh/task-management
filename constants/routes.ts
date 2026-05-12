type RouteEntry = { path: string };
type Route = Record<string, RouteEntry>;

export const ROUTES = {
   // auth
   login: { path: '/login' },
   register: { path: '/register' },

   // main
   home: { path: '/' },
} satisfies Route;

export const PROTECTED_ROUTES: string[] = [ROUTES.home.path];
