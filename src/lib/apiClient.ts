import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorBody } from '@/types/auth';

const baseURL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:105';

export const API_PREFIX = '/test';

export const apiClient = axios.create({
  baseURL: `${baseURL}${API_PREFIX}`,
  headers: { 'Content-Type': 'application/json' },
});

let accessToken: string | null = null;
let refreshHandler: (() => Promise<string | null>) | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setRefreshHandler(handler: (() => Promise<string | null>) | null): void {
  refreshHandler = handler;
}

export function isApiError(error: unknown): error is AxiosError<ApiErrorBody> {
  return axios.isAxiosError(error) && typeof error.response?.data?.code === 'string';
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      refreshHandler &&
      original &&
      !(original as InternalAxiosRequestConfig & { _retry?: boolean })._retry
    ) {
      (original as InternalAxiosRequestConfig & { _retry?: boolean })._retry = true;
      const newToken = await refreshHandler();
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      }
    }
    return Promise.reject(error);
  },
);
