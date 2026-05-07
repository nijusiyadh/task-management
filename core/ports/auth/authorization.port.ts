import type { Action, Resource } from '@/core/domain/auth/permissions';

export interface IAuthorizationPort {
   hasPermission<R extends Resource>(
      resource: R,
      action: Action<R>
   ): Promise<boolean>;
   /** @throws {ForbiddenError} if the current user lacks the requested permission */
   require<R extends Resource>(resource: R, action: Action<R>): Promise<void>;
}
