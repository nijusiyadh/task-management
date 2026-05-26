interface IHttpPort {
   get<T>(url: string): Promise<T>;
   post<T>(url: string, data?: unknown): Promise<T>;
   patch<T>(url: string, data?: unknown): Promise<T>;
   delete<T>(url: string): Promise<T>;
}

export type { IHttpPort };
