'use client';

import { useState, useRef, useCallback } from 'react';
import { Heading1 } from '@/components/heading';
import { RoulettePhysics } from './roulette-physics/roulette-physics';
import { RouletteWheel } from './roulette-wheel/roulette-wheel';
import { RouletteInput } from './roulette-input/roulette-input';
import { RouletteControls } from './roulette-controls/roulette-controls';
import { RouletteResult } from './roulette-result/roulette-result';
import { RouletteState, RouletteItem } from './roulette-types';
import { DEFAULT_ROULETTE_CONFIG } from './roulette-constants';

export function RouletteContainer() {
  const [state, setState] = useState<RouletteState>({
    isSpinning: false,
    currentAngle: 0,
    spinSpeed: 0,
    items: [],
    selectedItem: null,
  });

  const [showResult, setShowResult] = useState(false);
  const physicsRef = useRef<{ startSpin: () => void; stopSpin: () => void }>(
    null,
  );

  // 상태 업데이트 핸들러
  const handleStateChange = useCallback((newState: Partial<RouletteState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  }, []);

  // 아이템 변경 핸들러
  const handleItemsChange = useCallback((items: RouletteItem[]) => {
    setState((prev) => ({ ...prev, items }));
  }, []);

  // 회전 시작 핸들러
  const handleStartSpin = useCallback(() => {
    if (physicsRef.current) {
      physicsRef.current.startSpin();
    }
  }, []);

  // 결과 핸들러
  const handleResult = useCallback((item: RouletteItem) => {
    setState((prev) => ({ ...prev, selectedItem: item }));
    setShowResult(true);
  }, []);

  // 결과 모달 닫기
  const handleCloseResult = useCallback(() => {
    setShowResult(false);
    setState((prev) => ({ ...prev, selectedItem: null }));
  }, []);

  return (
    <div className="flex-grow flex flex-col gap-16 mx-auto w-full max-w-screen-md lg:flex-row">
      <div className="flex-1 flex flex-col gap-4">
        <Heading1>룰렛 돌리기</Heading1>
        <RouletteInput
          onItemsChange={handleItemsChange}
          disabled={state.isSpinning}
        />
      </div>

      <div className="sticky bg-white self-start lg:top-[20px] lg:pt-6 justify-center">
        <RouletteWheel config={DEFAULT_ROULETTE_CONFIG} state={state} />
        <RouletteControls state={state} onStartSpin={handleStartSpin} />

        <RoulettePhysics
          ref={physicsRef}
          config={DEFAULT_ROULETTE_CONFIG}
          state={state}
          onStateChange={handleStateChange}
          onResult={handleResult}
        />
      </div>
      <RouletteResult
        selectedItem={state.selectedItem}
        isVisible={showResult}
        onClose={handleCloseResult}
      />
    </div>
  );
}
