'use client';

import { Button } from '@/components/button';
import { RouletteState } from '../roulette-types';

interface RouletteControlsProps {
  state: RouletteState;
  onStartSpin: () => void;
  disabled?: boolean;
}

export function RouletteControls({
  state,
  onStartSpin,
  disabled = false,
}: RouletteControlsProps) {
  const canSpin = state.items.length > 0 && !state.isSpinning && !disabled;

  const handleStartSpin = () => {
    onStartSpin();
  };

  return (
    <div className="flex flex-col items-center space-y-4 z-20">
      <Button
        variant="primary"
        size="lg"
        disabled={!canSpin}
        onClick={handleStartSpin}
        className="z-20"
      >
        돌리기
      </Button>
    </div>
  );
}
