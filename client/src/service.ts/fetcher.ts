import { API_BASE_URL } from '../constants';
import { useAuthStore } from '../zustand/auth/store';

export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  request: async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = new Headers(options.headers || {});

    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new ApiError(errorData || 'API Error', response.status, errorData);
    }

    return response.json();
  },

  get: <T>(endpoint: string) => api.request<T>(endpoint),

  post: <T>(endpoint: string, data?: unknown) =>
    api.request<T>(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: unknown) =>
    api.request<T>(endpoint, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  delete: <T>(endpoint: string) =>
    api.request<T>(endpoint, { method: 'DELETE' }),
};
