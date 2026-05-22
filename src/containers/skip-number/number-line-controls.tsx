'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';

interface NumberLineControlsProps {
  startNumber: number;
  stepSize: number;
  tickInterval: number;
  onStartNumberChange: (n: number) => void;
  onStepSizeChange: (n: number) => void;
  onTickIntervalChange: (n: number) => void;
  onJumpForward: () => void;
  onJumpBackward: () => void;
  onReset: () => void;
}

const useNumberInput = (
  value: number,
  onChange: (n: number) => void,
  defaultVal: number,
  minVal?: number,
) => {
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    setDisplay(String(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplay(raw);

    if (raw !== '' && raw !== '-') {
      const num = Number(raw);
      if (!Number.isNaN(num)) {
        onChange(minVal !== undefined ? Math.max(minVal, num) : num);
      }
    }
  };

  const handleBlur = () => {
    if (display === '' || display === '-') {
      onChange(defaultVal);
      setDisplay(String(defaultVal));
      return;
    }

    const num = Number(display);
    const final = minVal !== undefined ? Math.max(minVal, num) : num;
    onChange(final);
    setDisplay(String(final));
  };

  return { display, handleChange, handleBlur };
};

export function NumberLineControls({
  startNumber,
  stepSize,
  tickInterval,
  onStartNumberChange,
  onStepSizeChange,
  onTickIntervalChange,
  onJumpForward,
  onJumpBackward,
  onReset,
}: NumberLineControlsProps) {
  const startInput = useNumberInput(startNumber, onStartNumberChange, 0);
  const stepInput = useNumberInput(stepSize, onStepSizeChange, 1); // minVal 제거
  const tickInput = useNumberInput(tickInterval, onTickIntervalChange, 1, 1);

  return (
    <Card className="shadow-lg border-2 border-border">
      <CardContent className="p-5">
        <div className="flex flex-wrap items-end gap-4 justify-center">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="skip-number-start"
              className="text-base font-semibold text-foreground"
            >
              시작 숫자
            </Label>
            <Input
              id="skip-number-start"
              type="number"
              value={startInput.display}
              onChange={startInput.handleChange}
              onBlur={startInput.handleBlur}
              className="w-28 text-right text-lg font-bold"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label
              htmlFor="skip-number-step"
              className="text-base font-semibold text-foreground"
            >
              뛰어셀 수
            </Label>
            <Input
              id="skip-number-step"
              type="number"
              value={stepInput.display}
              onChange={stepInput.handleChange}
              onBlur={stepInput.handleBlur}
              className="w-28 text-right text-lg font-bold"
              // min={1} 제거
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label
              htmlFor="skip-number-tick"
              className="text-base font-semibold text-foreground"
            >
              눈금 간격
            </Label>
            <Input
              id="skip-number-tick"
              type="number"
              value={tickInput.display}
              onChange={tickInput.handleChange}
              onBlur={tickInput.handleBlur}
              className="w-28 text-right text-lg font-bold"
              min={1}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onJumpBackward}
              variant="gray-outline"
              size="md"
              className="gap-2 text-base font-bold border-2 hover:bg-foreground/10 w-24"
            >
              <ArrowLeft className="w-5 h-5" />
              뒤로
            </Button>

            <Button
              onClick={onJumpForward}
              size="md"
              className="gap-2 text-base font-bold w-24"
            >
              앞으로
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <Button
            onClick={onReset}
            variant="gray-ghost"
            size="md"
            className="gap-1 text-destructive hover:text-destructive"
          >
            <RotateCcw className="w-5 h-5" />
            초기화
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
