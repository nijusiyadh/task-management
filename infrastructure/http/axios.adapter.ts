import axios from 'axios';
import type { IHttpPort } from '@/core/ports/http/http.port';
import type { ApiResponseBody } from '@/lib/api/response';
import { apiClient } from './client';

export class ApiError extends Error {
   constructor(
      message: string,
      public readonly statusCode: number,
      public readonly code?: string
   ) {
      super(message);
      this.name = 'ApiError';
   }
}

export class AxiosAdapter implements IHttpPort {
   private async unwrap<T>(
      promise: Promise<{ data: ApiResponseBody<T> }>
   ): Promise<T> {
      try {
         const { data: body } = await promise;
         if (body.status === 'error')
            throw new ApiError(
               body.error.message ?? body.error.code,
               400,
               body.error.code
            );
         return body.data;
      } catch (err) {
         // Axios throws for 4xx/5xx — extract the structured API error body
         if (axios.isAxiosError(err) && err.response?.data) {
            const body = err.response.data as ApiResponseBody<T>;
            if (body.status === 'error') {
               throw new ApiError(
                  body.error.message ?? body.error.code,
                  err.response.status,
                  body.error.code
               );
            }
         }
         throw err;
      }
   }

   get<T>(url: string): Promise<T> {
      return this.unwrap(apiClient.get(url));
   }

   post<T>(url: string, data?: unknown): Promise<T> {
      return this.unwrap(apiClient.post(url, data));
   }

   patch<T>(url: string, data?: unknown): Promise<T> {
      return this.unwrap(apiClient.patch(url, data));
   }

   delete<T>(url: string): Promise<T> {
      return this.unwrap(apiClient.delete(url));
   }
}
