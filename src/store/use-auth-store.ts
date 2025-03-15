import { create } from 'zustand';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Zustand 전역 상태 관리
interface AuthState {
  isAuthenticated: boolean;
  user: number | null;
  setUser: (userId: number) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false, // 초기값: 로그아웃 상태
  user: null,

  // ✅ CSRF 토큰 저장 함수

  // ✅ 로그인 시 유저 설정
  setUser: (userId) => set({ isAuthenticated: true, user: userId }),

  // ✅ 로그아웃 함수
  logout: async () => {
    try {
      const response = await fetch(`${SERVER_URL}/login`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        set({ isAuthenticated: false, user: null });
        console.debug('로그인 성공');
      } else {
        const data = await response.json();
        console.error(response.status, data.message);
      }
    } catch (error) {
      console.error(error);
    }
  },
}));

export const useAuthState = () =>
  useAuthStore((state) => state.isAuthenticated);
