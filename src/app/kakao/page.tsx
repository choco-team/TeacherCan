'use client';

import { useAuthStore } from '@/store/use-auth-store';
import { kakaoLogin } from '@/utils/kakaoLogin';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function KakaoAuthPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    async function loginAndRedirect() {
      await kakaoLogin(setUser); // ✅ 로그인 완료될 때까지 대기
      router.replace('/'); // ✅ 로그인 완료 후 이동
    }
    loginAndRedirect();
  }, [router]);
}
