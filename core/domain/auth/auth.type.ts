import type { UserRole } from './role';

export type AuthUser = {
   id: string;
   name: string;
   email: string;
   role: UserRole;
   banned: boolean;
};

export type AuthSession = {
   id: string;
   userId: string;
   user: AuthUser;
   expiresAt: Date;
};
