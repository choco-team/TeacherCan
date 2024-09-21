'use client';

import { Button } from '@/components/button';
import { Heading2 } from '@/components/heading';
import { Input } from '@/components/input';
import { useCountdown } from './countdown.hooks';

export default function Countdown() {
  const {
    minutes,
    seconds,
    isActive,
    isPaused,
    handleMinutesChange,
    handleSecondsChange,
    handlePause,
    handleReset,
  } = useCountdown();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <Heading2 className="text-center">Countdown Timer</Heading2>
        <div className="flex items-center justify-center mb-6 space-x-4">
          <Input
            type="number"
            id="minutes"
            placeholder="Minutes"
            value={minutes}
            onChange={(e) => handleMinutesChange(Number(e.target.value))}
            className="w-1/3 text-right font-bold text-lg"
          />
          <Input
            type="number"
            id="seconds"
            placeholder="Seconds"
            value={seconds}
            onChange={(e) => handleSecondsChange(Number(e.target.value))}
            className="w-1/3 text-right font-bold text-lg"
          />
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={handlePause} variant="primary-outline">
            {isPaused || !isActive ? 'Start' : 'Pause'}
          </Button>
          <Button onClick={handleReset} variant="primary-outline">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
