'use client';

import { useAuthState } from '@/store/use-auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import QuestionInfo from './questionInfo';

export default function WritingPage() {
  const isAuthenticated = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // 인증 상태에 따라 조건부 렌더링
  return isAuthenticated ? <QuestionInfo /> : null; // 리다이렉트 중일 때는 아무것도 표시하지 않음
}
