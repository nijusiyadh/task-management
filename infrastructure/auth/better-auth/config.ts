import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { prisma } from '@/infrastructure/database/prisma/client';

export const auth = betterAuth({
   database: prismaAdapter(prisma, {
      provider: 'postgresql',
   }),

   emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      autoSignIn: true,
      requireEmailVerification: false, // set to true once email sending is configured
   },

   plugins: [
      admin({
         defaultRole: 'user',
         adminRoles: ['admin'],
      }),
   ],

   session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      freshAge: 60 * 60 * 24,
   },
});

export type Auth = typeof auth;
