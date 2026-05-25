import type { AuthSession } from '@/core/domain/auth/auth.type';
import type { NextRequest, NextResponse } from 'next/server';
import { ForbiddenError, UnauthorizedError } from '@/core/domain/auth/error';
import { NotFoundError } from '@/core/domain/errors';
import { authenticationService } from '@/infrastructure/container';
import { errorResponse } from './response';

export function handleDomainError(err: unknown) {
   if (err instanceof UnauthorizedError) {
      return errorResponse({ statusCode: 401, message: err.message });
   }

   if (err instanceof ForbiddenError) {
      return errorResponse({ statusCode: 403, message: err.message });
   }

   if (err instanceof NotFoundError) {
      return errorResponse({ statusCode: 404, message: err.message });
   }

   console.error('[unhandled error]', err);
   return errorResponse({ statusCode: 500, message: 'Internal server error' });
}

type AuthHandler = (
   req: NextRequest,
   context: { params: Promise<Record<string, string>>; session: AuthSession }
) => Promise<NextResponse>;

export function withAuth(handler: AuthHandler) {
   return async (
      req: NextRequest,
      context: { params: Promise<Record<string, string>> }
   ): Promise<NextResponse> => {
      try {
         const session = await authenticationService.requireSession();
         return await handler(req, { ...context, session });
      } catch (err) {
         return handleDomainError(err);
      }
   };
}
