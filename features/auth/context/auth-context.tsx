'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useSession } from '@/infrastructure/auth/better-auth/client';
import type { AuthSession } from '@/core/domain/auth/auth.type';
import { PROTECTED_ROUTES, ROUTES } from '@/constants/routes';

interface AuthContextValue {
   session: AuthSession | null;
   isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapSession(
   data: ReturnType<typeof useSession>['data']
): AuthSession | null {
   if (!data) return null;

   return {
      id: data.session.id,
      userId: data.user.id,
      expiresAt: data.session.expiresAt,
      user: {
         id: data.user.id,
         name: data.user.name,
         email: data.user.email,
         role: (data.user.role ?? 'user') as AuthSession['user']['role'],
         banned: data.user.banned ?? false,
      },
   };
}

export function AuthProvider({ children }: { children: ReactNode }) {
   const { data, isPending } = useSession();
   const router = useRouter();
   const pathname = usePathname();
   const session = mapSession(data);

   useEffect(() => {
      if (!isPending && !session && PROTECTED_ROUTES.includes(pathname)) {
         router.replace(ROUTES.login.path);
      }
   }, [isPending, session, pathname, router]);

   if (isPending) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
         </div>
      );
   }

   return (
      <AuthContext.Provider value={{ session, isAuthenticated: !!session }}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth(): AuthContextValue {
   const ctx = useContext(AuthContext);
   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
   return ctx;
}
