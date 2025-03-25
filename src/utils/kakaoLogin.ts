// kakaoLogin.ts
import { API_URL, fetchWithAuth } from '@/utils/api/fetchWithAuth';

export async function kakaoLogin(setUser: (id: number) => void) {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (!API_URL || !code) return;

  try {
    const response = await fetchWithAuth(`/login/kakao?code=${code}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.userId) {
        setUser(data.userId); // ✅ 훅 아님, 함수만 받아서 사용
        console.log('✅ 카카오 로그인 성공');
      }
    } else {
      throw new Error('카카오 로그인 실패');
    }
  } catch (error) {
    console.error('카카오 로그인 오류:', error);
  }
}
