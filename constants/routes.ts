type RouteEntry = { path: string; getPath: () => string };
type Route = Record<string, RouteEntry>;

export const ROUTES = {
   // auth
   signIn: { path: '/sign-in', getPath: () => '/sign-in' },
   signUp: { path: '/sign-up', getPath: () => '/sign-up' },

   // main
   home: { path: '/', getPath: () => '/' },
} satisfies Route;

export const PUBLIC_ROUTES: string[] = [ROUTES.signIn.path, ROUTES.signUp.path];

export const PROTECTED_ROUTES: string[] = [ROUTES.home.path];
