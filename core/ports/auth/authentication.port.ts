import type { AuthSession } from '@/core/domain/auth/auth.type';

export interface IAuthenticationPort {
   getSession(): Promise<AuthSession | null>;
   requireSession(): Promise<AuthSession>;
}
