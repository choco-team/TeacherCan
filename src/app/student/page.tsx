'use client';

import { useState, useEffect } from 'react';
import StudentPage from './studentPage';

export default function StudentRoute() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 클라이언트 사이드에서만 StudentPage 렌더링
  return (
    <div>
      {isMounted ? (
        <StudentPage />
      ) : (
        <div className="p-4">페이지를 불러오는 중...</div>
      )}
    </div>
  );
}
