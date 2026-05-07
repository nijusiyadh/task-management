import type { Action, Resource } from './permissions';

export class UnauthorizedError extends Error {
   constructor(message = 'Authentication required') {
      super(message);
      this.name = 'UnauthorizedError';
   }
}

export class ForbiddenError extends Error {
   readonly action?: Action<Resource>;
   readonly resource?: Resource;

   constructor(input?: {
      action?: Action<Resource>;
      resource?: Resource;
      message?: string;
   }) {
      const message =
         input?.message ??
         (input?.action && input?.resource
            ? `Not allowed to ${input.action} ${input.resource}`
            : 'Forbidden');
      super(message);
      this.name = 'ForbiddenError';
      this.action = input?.action;
      this.resource = input?.resource;
   }
}
