'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '@/components/button';

function ActivityCountInput() {
  const [count, setCount] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = () => {
    if (count < 1 || Number.isNaN(count)) {
      setError('1개 이상의 활동을 입력해주세요.');
      return;
    }
    router.push(`/routine-timer/setup?count=${count}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-blue-50">
      <h1 className="text-2xl font-bold">활동 개수를 입력하세요</h1>
      <input
        type="number"
        min="1"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="border rounded px-4 py-2 text-center w-40"
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
      >
        다음
      </Button>
    </div>
  );
}

export default ActivityCountInput;
