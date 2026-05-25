import type { AuthSession } from '@/core/domain/auth/auth.type';
import type {
   WorkspaceMember,
   WorkspaceRole,
} from '@/core/domain/workspace/workspace.type';
import type { NextRequest, NextResponse } from 'next/server';
import { ForbiddenError, UnauthorizedError } from '@/core/domain/auth/error';
import { NotFoundError } from '@/core/domain/errors';
import {
   authenticationService,
   logger,
   workspaceService,
} from '@/infrastructure/container';
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

   return errorResponse({ statusCode: 500, message: 'Internal server error' });
}

export async function requireWorkspaceMember(
   workspaceId: string,
   userId: string,
   roles?: WorkspaceRole[]
): Promise<WorkspaceMember> {
   const member = await workspaceService.getMember(workspaceId, userId);
   if (!member) throw new ForbiddenError();
   if (roles && !roles.includes(member.role)) throw new ForbiddenError();
   return member;
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
      const start = Date.now();
      const { method, url } = req;

      try {
         const session = await authenticationService.requireSession();
         const response = await handler(req, { ...context, session });

         logger.info('API request completed', {
            method,
            url,
            status: response.status,
            duration: `${Date.now() - start}ms`,
            userId: session.userId,
         });

         return response;
      } catch (err) {
         const response = handleDomainError(err);
         const logFn = response.status >= 500 ? 'error' : 'warn';

         logger[logFn]('API request failed', {
            method,
            url,
            status: response.status,
            duration: `${Date.now() - start}ms`,
            err,
         });

         return response;
      }
   };
}
