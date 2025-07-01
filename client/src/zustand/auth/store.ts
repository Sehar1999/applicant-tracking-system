import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '../../types';
import { AUTH_STORAGE } from '../../constants';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      loading: true,
      setAuth: (accessToken: string, user?: User) =>
        set({
          accessToken,
          user,
          isAuthenticated: true,
          loading: false,
        }),
      logout: () =>
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          loading: false,
        }),
    }),
    {
      name: AUTH_STORAGE,
    }
  )
);
