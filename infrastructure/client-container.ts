import type { IHttpPort } from '@/core/ports/http/http.port';
import { AxiosAdapter } from './http/axios.adapter';

export const httpClient: IHttpPort = new AxiosAdapter();
