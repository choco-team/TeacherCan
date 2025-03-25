import { create } from 'zustand';
import { AuthState } from '@/types/answer-sheet-types';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  csrfToken: null,

  setUser: (userId) => set({ isAuthenticated: true, user: userId }),
  setCsrf: (csrfToken) => set({ csrfToken }),

  // 삭제된 logout: utils/logout.ts로 이동
}));

export const useAuthState = () =>
  useAuthStore((state) => state.isAuthenticated);
