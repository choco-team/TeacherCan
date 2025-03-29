import { create } from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  user: number | null;
  csrfToken: string | null;
  setUser: (userId: number) => void;
  setCsrf: (csrfToken: string) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  csrfToken: null,

  setUser: (userId) => set({ isAuthenticated: true, user: userId }),
  setCsrf: (csrfToken) => set({ csrfToken }),
}));

export const useAuthState = () =>
  useAuthStore((state) => state.isAuthenticated);
