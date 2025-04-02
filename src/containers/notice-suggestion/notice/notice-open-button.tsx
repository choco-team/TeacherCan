'use client';

import { PencilIcon } from 'lucide-react';
import { Button } from '@/components/button';
import { ROUTE } from '@/constants/route';

export default function NoticeTextareaOpenButton() {
  return (
    <Button
      variant="gray-outline"
      size="sm"
      className="self-center flex items-center gap-x-1"
      onClick={() => {
        window.open(ROUTE.NOTICE, '_blank');
      }}
    >
      <PencilIcon className="size-3.5" />
      알림장 바로 쓰기
    </Button>
  );
}
