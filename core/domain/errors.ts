export class NotFoundError extends Error {
   readonly resource?: string;

   constructor(resource?: string) {
      const message = resource ? `${resource} not found` : 'Resource not found';
      super(message);
      this.name = 'NotFoundError';
      this.resource = resource;
   }
}
