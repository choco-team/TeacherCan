'use client';

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
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handleStartSpin}
          disabled={!canSpin}
          className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
            canSpin
              ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {state.isSpinning ? '회전 중...' : 'Start'}
        </button>
      </div>

      {state.items.length === 0 && (
        <p className="text-sm text-gray-500 text-center">이름을 입력해주세요</p>
      )}

      {state.isSpinning && (
        <div className="text-sm text-blue-600 text-center">
          룰렛이 회전하고 있습니다...
        </div>
      )}
    </div>
  );
}
