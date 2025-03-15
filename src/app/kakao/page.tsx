'use client';

import { kakaoLogin } from '@/utils/kakaoLogin';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function KakaoAuthPage() {
  const router = useRouter();

  useEffect(() => {
    async function loginAndRedirect() {
      await kakaoLogin(); // ✅ 로그인 완료될 때까지 대기
      router.replace('/'); // ✅ 로그인 완료 후 이동
    }
    loginAndRedirect();
  }, [router]);
}
