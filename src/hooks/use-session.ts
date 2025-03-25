import { useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { fetchWithAuth } from '@/utils/api/fetchWithAuth';

export function useSessionCheck() {
  const { setUser } = useAuthStore();

  async function checkSession() {
    try {
      const response = await fetchWithAuth(`/login`, {
        method: 'GET',
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
