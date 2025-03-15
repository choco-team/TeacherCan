import { useAuthStore } from '@/store/use-auth-store';

export async function kakaoLogin() {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  if (typeof window === 'undefined') {
    console.error(
      'window 객체가 존재하지 않습니다. 클라이언트 환경에서 실행해야 합니다.',
    );
    return;
  }

  // ✅ `URLSearchParams`를 사용하여 `code` 가져오기 (useSearchParams 사용 안함)
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (!API_URL || !code) {
    console.error('API URL 또는 인증 코드가 없습니다.');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/login/kakao?code=${code}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.userId) {
        const { setUser } = useAuthStore.getState();
        setUser(data.userId);
        console.log('✅ 카카오 로그인 성공');
      }
    } else {
      throw new Error('카카오 로그인 실패');
    }
  } catch (error) {
    console.error('카카오 로그인 오류:', error);
  }
}
