import { useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';

export function useSessionCheck() {
  const { setUser } = useAuthStore();
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  async function checkSession() {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.userId) {
          return;
        }
        setUser(data.userId); // 로그인 상태 업데이트
      } else {
        console.error('세션 확인 실패:', await response.json());
      }
    } catch (error) {
      console.error('서버 에러:', error);
    }
  }

  useEffect(() => {
    checkSession();
  }, []);
}
