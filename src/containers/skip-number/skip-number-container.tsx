'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { Heading1 } from '@/components/heading';

import { Card } from '@/components/card';

import { NumberLineControls } from './number-line-controls';
import { NumberLineDisplay } from './number-line-display';
import { JumpHistory } from './jump-history';

import type { Jump } from './types';

export default function SkipNumberContainer() {
  const [startNumber, setStartNumber] = useState(10);
  const [stepSize, setStepSize] = useState(20);
  const [tickInterval, setTickInterval] = useState(10);
  const [jumps, setJumps] = useState<Jump[]>([]);

  const allNumbers = useMemo(() => {
    return [startNumber, ...jumps.map((j) => j.to)];
  }, [startNumber, jumps]);

  const handleJumpForward = useCallback(() => {
    const lastNum = allNumbers[allNumbers.length - 1];
    setJumps((prev) => [
      ...prev,
      {
        from: lastNum,
        to: lastNum + stepSize,
        step: stepSize,
        index: prev.length,
      },
    ]);
  }, [allNumbers, stepSize]);

  const handleJumpBackward = useCallback(() => {
    const lastNum = allNumbers[allNumbers.length - 1];
    setJumps((prev) => [
      ...prev,
      {
        from: lastNum,
        to: lastNum - stepSize,
        step: -stepSize,
        index: prev.length,
      },
    ]);
  }, [allNumbers, stepSize]);

  const handleReset = useCallback(() => setJumps([]), []);

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      <Card className="p-5 flex flex-col gap-3">
        <Heading1 className="text-xl font-bold">숫자 뛰어세기</Heading1>
        <p className="text-sm text-muted-foreground">
          시작 숫자부터 `뛰어셀 수(스텝)`만큼 건너뛰며 수직선을 연습해요.
        </p>
      </Card>

      <NumberLineControls
        startNumber={startNumber}
        stepSize={stepSize}
        tickInterval={tickInterval}
        onStartNumberChange={setStartNumber}
        onStepSizeChange={setStepSize}
        onTickIntervalChange={setTickInterval}
        onJumpForward={handleJumpForward}
        onJumpBackward={handleJumpBackward}
        onReset={handleReset}
      />

      <NumberLineDisplay
        jumps={jumps}
        allNumbers={allNumbers}
        tickInterval={tickInterval}
      />

      {jumps.length > 0 && (
        <JumpHistory jumps={jumps} startNumber={startNumber} />
      )}
    </div>
  );
}
