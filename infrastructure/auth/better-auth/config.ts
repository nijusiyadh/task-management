import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { createAccessControl } from 'better-auth/plugins/access';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { PERMISSION_MAP } from '@/core/domain/auth/permissions';
import { prisma } from '@/infrastructure/database/prisma/client';

export const ac = createAccessControl(PERMISSION_MAP);

const ownerRole = ac.newRole({
   task: ['create', 'read', 'update', 'delete', 'assign'],
});

const adminRole = ac.newRole({
   task: ['create', 'read', 'update', 'delete', 'assign'],
});

const memberRole = ac.newRole({
   task: ['create', 'read', 'update'],
});

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
         ac,
         defaultRole: 'member',
         adminRoles: ['admin', 'owner'],
         roles: { owner: ownerRole, admin: adminRole, member: memberRole },
      }),
   ],

   session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      freshAge: 60 * 60 * 24,
   },
});

export type Auth = typeof auth;
