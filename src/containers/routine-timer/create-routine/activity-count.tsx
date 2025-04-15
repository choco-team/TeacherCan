'use client';

import { useState } from 'react';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Heading4 } from '@/components/heading';

type Props = {
  onNext: (count: number) => void;
};

function ActivityCount({ onNext }: Props) {
  const [count, setCount] = useState(1);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-24 max-w-md mx-auto">
      <Heading4 className="text-2xl font-bold text-center">
        활동 개수 입력
      </Heading4>
      <Input
        type="number"
        value={count}
        min={1}
        onChange={(e) => setCount(Number(e.target.value))}
        placeholder="활동 개수를 입력하세요"
        className="w-40 text-center"
      />
      <Button onClick={() => onNext(count)} className="w-40">
        다음
      </Button>
    </div>
  );
}

export default ActivityCount;
