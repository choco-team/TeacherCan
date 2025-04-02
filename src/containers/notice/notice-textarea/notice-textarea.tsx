'use client';

import { useEffect, useRef, useState } from 'react';
import { intlFormat } from 'date-fns';
import { cn } from '@/styles/utils';

export default function NoticeTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialValue = `${intlFormat(new Date(), {
    month: 'short',
    day: 'numeric',
    weekday: 'narrow',
  })} 알림장\n`;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      const { length } = textareaRef.current.value;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, []);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      placeholder="알림장 내용을 입력하세요..."
      onChange={(event) => setValue(event.target.value)}
      className={cn(
        'size-full bg-transparent text-7xl font-bold text-inherit leading-normal caret-primary resize-none focus:outline-none',
        'max-lg:text-5xl',
        'max-sm:text-2xl max-sm:font-semibold',
      )}
    />
  );
}
