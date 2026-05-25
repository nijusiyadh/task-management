import { headers } from 'next/headers';

import type { IAuthenticationPort } from '@/core/ports/auth/authentication.port';
import type { AuthSession } from '@/core/domain/auth/auth.type';
import { UnauthorizedError } from '@/core/domain/auth/error';

import type { Auth } from './config';

export class BetterAuthAdapter implements IAuthenticationPort {
   constructor(private readonly auth: Auth) {}

   async getSession(): Promise<AuthSession | null> {
      const response = await this.auth.api.getSession({
         headers: await headers(),
      });

      if (!response) return null;

      const { session, user } = response;

      return {
         id: session.id,
         userId: user.id,
         expiresAt: session.expiresAt,
         user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: (user.role ?? 'user') as AuthSession['user']['role'],
            banned: user.banned ?? false,
         },
      };
   }

   async requireSession(): Promise<AuthSession> {
      const session = await this.getSession();
      if (!session) throw new UnauthorizedError();
      if (session.user.banned) throw new UnauthorizedError('Account is banned');
      return session;
   }
}
