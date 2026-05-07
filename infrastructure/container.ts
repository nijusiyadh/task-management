import type { IAuthenticationPort } from '@/core/ports/auth/authentication.port';
import type { IAuthorizationPort } from '@/core/ports/auth/authorization.port';

import { BetterAuthAdapter } from './auth/better-auth/better-auth.adapter';
import { auth } from './auth/better-auth/config';

const betterAuthAdapter = new BetterAuthAdapter(auth);

export const authenticationService: IAuthenticationPort = betterAuthAdapter;
export const authorizationService: IAuthorizationPort = betterAuthAdapter;
