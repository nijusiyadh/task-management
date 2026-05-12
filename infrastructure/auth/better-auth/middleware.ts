import { getSessionCookie } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';

import { PROTECTED_ROUTES, ROUTES } from '@/constants/routes';

const AUTH_API_PREFIX = '/api/auth';
const AUTH_ROUTES = [ROUTES.login.path, ROUTES.register.path];

export const betterAuthProxy = async (request: NextRequest) => {
   const { pathname } = request.nextUrl;

   // Let Better Auth handle its own API routes
   if (pathname.startsWith(AUTH_API_PREFIX)) {
      return NextResponse.next();
   }

   const sessionCookie = getSessionCookie(request);

   const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

   if (isAuthRoute && sessionCookie) {
      return NextResponse.redirect(new URL(ROUTES.home.path, request.url));
   }

   const isProtected = PROTECTED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
   );

   if (isProtected && !sessionCookie) {
      return NextResponse.redirect(new URL(ROUTES.login.path, request.url));
   }

   return NextResponse.next();
};
