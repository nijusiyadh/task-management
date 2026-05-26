import type { IHttpPort } from '@/core/ports/http/http.port';
import type { ApiResponseBody } from '@/lib/api/response';
import { apiClient } from './client';

export class AxiosAdapter implements IHttpPort {
   private async unwrap<T>(
      promise: Promise<{ data: ApiResponseBody<T> }>
   ): Promise<T> {
      const { data: body } = await promise;
      if (body.status === 'error')
         throw new Error(body.error.message ?? body.error.code);
      return body.data;
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
