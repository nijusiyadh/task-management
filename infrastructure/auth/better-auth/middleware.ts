import { getSessionCookie } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';

import { PROTECTED_ROUTES, PUBLIC_ROUTES, ROUTES } from '@/constants/routes';

export const betterAuthProxy = async (request: NextRequest) => {
   const { pathname } = request.nextUrl;
   const sessionCookie = getSessionCookie(request);

   const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

   if (isPublic && sessionCookie) {
      return NextResponse.redirect(new URL(ROUTES.home.getPath(), request.url));
   }

   const isProtected = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
   );

   if (isProtected && !sessionCookie) {
      return NextResponse.redirect(
         new URL(ROUTES.signIn.getPath(), request.url)
      );
   }

   return NextResponse.next();
};
