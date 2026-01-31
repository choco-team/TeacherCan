'use client';

import { memo } from 'react';
import { format } from 'date-fns';
import { useKstNow } from '@/hooks/use-kst-now';
import type { DigitalClockOptions } from './clock-types';

interface DigitalClockProps extends DigitalClockOptions {}

export const DigitalClock = memo(function DigitalClock({
  use24h,
}: DigitalClockProps) {
  const now = useKstNow(200); // always show seconds

  const digitsFmt = use24h ? 'HH:mm:ss' : 'hh:mm:ss';
  const ampm = use24h ? '' : format(now, 'a');

  const fontSize = use24h
    ? 'clamp(72px, 10.8vw, 360px)' // 24h: 숫자만 고려
    : 'clamp(72px, 9.6vw, 360px)'; // 12h: AM/PM 포함 폭 고려

  return (
    <div
      className="flex h-full w-full items-center justify-center text-gray-900"
      aria-live="polite"
    >
      <div
        className="inline-flex items-center"
        style={{ fontSize, letterSpacing: '0.03em' }}
      >
        <span className="font-number font-semibold tracking-tight tabular-nums">
          {format(now, digitsFmt)}
        </span>
        {!use24h && (
          <span className="ml-5 font-sans text-[0.6em] md:text-[0.55em]">
            {ampm}
          </span>
        )}
      </div>
    </div>
  );
});
