import { NextResponse } from 'next/server';

const HTTP_STATUS_CODE_MAP = {
   400: 'BAD_REQUEST',
   401: 'UNAUTHENTICATED',
   403: 'FORBIDDEN',
   404: 'NOT_FOUND',
   409: 'CONFLICT',
   422: 'UNPROCESSABLE_ENTITY',
   429: 'TOO_MANY_REQUESTS',
   500: 'INTERNAL_ERROR',
} as const;

type ErrorStatusCode = keyof typeof HTTP_STATUS_CODE_MAP;

export type PaginationMeta = {
   page: number;
   limit: number;
   total: number;
   totalPages: number;
};

type SuccessBody<T> = {
   status: 'success';
   data: T;
   meta?: PaginationMeta;
};

type ErrorBody = {
   status: 'error';
   error: {
      code: string;
      message?: string;
      details?: Record<string, string[]>;
   };
};

export type ApiResponseBody<T> = SuccessBody<T> | ErrorBody;

export function successResponse<T>(
   data: T,
   meta?: PaginationMeta,
   status = 200
) {
   return NextResponse.json<SuccessBody<T>>(
      { status: 'success', data, ...(meta && { meta }) },
      { status }
   );
}

export function errorResponse({
   message,
   statusCode,
   details,
}: {
   message?: string;
   statusCode: ErrorStatusCode;
   details?: Record<string, string[]>;
}) {
   const code = HTTP_STATUS_CODE_MAP[statusCode];

   return NextResponse.json<ErrorBody>(
      { status: 'error', error: { code, message, details } },
      { status: statusCode }
   );
}
