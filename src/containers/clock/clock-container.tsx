'use client';

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  type ChangeEvent,
} from 'react';
import { AnimatePresence } from 'framer-motion';
import { Input } from '@/components/input';
import { Switch } from '@/components/switch';
import { usePathname } from 'next/navigation';
import { AnalogClock } from './analog-clock';
import { DigitalClock } from './digital-clock';
import type { ClockType, DigitalClockOptions } from './clock-types';

const CLOCK_MEMO_STORAGE_KEY = 'teacher-can:clock-memo';
const MEMO_FONT_SIZE_DESKTOP = 72;
const MEMO_FONT_SIZE_DEFAULT = 36;
const MEMO_FONT_SIZE_MIN = 18;

export function ClockContainer() {
  const pathname = usePathname();
  const [type, setType] = useState<ClockType>('analog');
  const [digitalOptions, setDigitalOptions] = useState<DigitalClockOptions>({
    use24h: true,
  });
  const [analogSize, setAnalogSize] = useState<number | null>(null);
  const [memo, setMemo] = useState('');
  const [memoFontSize, setMemoFontSize] = useState(MEMO_FONT_SIZE_DEFAULT);
  const memoInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const computeSize = () => {
      if (typeof window === 'undefined') return;
      const size = Math.floor(
        Math.min(window.innerWidth * 0.5, window.innerHeight * 0.5),
      );
      setAnalogSize(size);
    };
    computeSize();
    window.addEventListener('resize', computeSize);
    return () => window.removeEventListener('resize', computeSize);
  }, []);

  useEffect(() => {
    if (pathname?.startsWith('/clock/digital')) {
      setType('digital');
    } else if (pathname?.startsWith('/clock/analog')) {
      setType('analog');
    }
  }, [pathname]);

  const getMaxMemoFontSize = useCallback(() => {
    if (typeof window === 'undefined') return MEMO_FONT_SIZE_DEFAULT;
    return window.innerWidth >= 1024
      ? MEMO_FONT_SIZE_DESKTOP
      : MEMO_FONT_SIZE_DEFAULT;
  }, []);

  const fitMemoText = useCallback(() => {
    const input = memoInputRef.current;
    if (!input) return;
    let nextSize = getMaxMemoFontSize();
    input.style.fontSize = `${nextSize}px`;
    while (
      input.scrollWidth > input.clientWidth &&
      nextSize > MEMO_FONT_SIZE_MIN
    ) {
      nextSize -= 1;
      input.style.fontSize = `${nextSize}px`;
    }
    if (memoFontSize !== nextSize) {
      setMemoFontSize(nextSize);
    }
  }, [getMaxMemoFontSize, memoFontSize]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedMemo = window.localStorage.getItem(CLOCK_MEMO_STORAGE_KEY);
    if (storedMemo) {
      setMemo(storedMemo);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CLOCK_MEMO_STORAGE_KEY, memo);
  }, [memo]);

  useLayoutEffect(() => {
    fitMemoText();
  }, [memo, fitMemoText]);

  useEffect(() => {
    const handleResize = () => fitMemoText();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitMemoText]);

  const handleChangeMemo = (event: ChangeEvent<HTMLInputElement>) => {
    setMemo(event.target.value);
  };

  const clock = useMemo(() => {
    if (type === 'analog') {
      if (!analogSize) return null;
      return <AnalogClock size={analogSize} />;
    }
    return <DigitalClock use24h={digitalOptions.use24h} />;
  }, [type, digitalOptions, analogSize]);

  return (
    <div className="h-[calc(100vh-120px)] w-full">
      <div className="relative flex h-full flex-col items-center justify-center">
        <div className="absolute inset-x-0 top-4 px-4">
          <Input
            type="text"
            value={memo}
            placeholder="메모"
            ref={memoInputRef}
            style={{ fontSize: memoFontSize }}
            className="w-full dark:bg-black h-16 lg:h-28 rounded-xl lg:rounded-2xl text-center font-extrabold"
            onChange={handleChangeMemo}
          />
        </div>
        {/* 24h switch overlay */}
        {type === 'digital' && (
          <div className="absolute right-4 bottom-4 flex items-center gap-2 text-sm text-gray-700">
            <Switch
              id="digital-24h"
              checked={digitalOptions.use24h}
              onCheckedChange={(checked) =>
                setDigitalOptions((s) => ({
                  ...s,
                  use24h: checked,
                }))
              }
            />
            <label htmlFor="digital-24h" className="cursor-pointer">
              24시간
            </label>
          </div>
        )}
        <AnimatePresence mode="wait">
          <div key={type} className="w-full flex items-center justify-center">
            {clock}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
