export function loginWithKakao() {
  const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL;

  if (typeof window === 'undefined') {
    console.error(
      'window 객체를 사용할 수 없습니다. 클라이언트 환경에서 실행해야 합니다.',
    );
    return;
  }

  const REDIRECT_URI = `${CLIENT_URL}/kakao`;

  if (!KAKAO_CLIENT_ID || !REDIRECT_URI) {
    console.error('Kakao OAuth 설정이 올바르지 않습니다.');
    return;
  }

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  window.location.href = KAKAO_AUTH_URL;
}
