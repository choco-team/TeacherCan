'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/switch';
import { usePathname } from 'next/navigation';
import { AnalogClock } from './analog-clock';
import { DigitalClock } from './digital-clock';
import type { ClockType, DigitalClockOptions } from './clock-types';

export function ClockContainer() {
  const pathname = usePathname();
  const [type, setType] = useState<ClockType>('analog');
  const [digitalOptions, setDigitalOptions] = useState<DigitalClockOptions>({
    use24h: true,
  });
  const [analogSize, setAnalogSize] = useState(360);

  useEffect(() => {
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

  const clock = useMemo(() => {
    if (type === 'analog') {
      return <AnalogClock size={analogSize} />;
    }
    return <DigitalClock use24h={digitalOptions.use24h} />;
  }, [type, digitalOptions, analogSize]);

  return (
    <div className="h-[calc(100vh-120px)] w-full">
      <div className="relative flex h-full flex-col items-center justify-center">
        {/* 24h switch overlay */}
        {type === 'digital' && (
          <div className="absolute right-4 top-4 flex items-center gap-2 text-sm text-gray-700">
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
