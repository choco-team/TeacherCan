'use client';

import { useState, useRef, useCallback } from 'react';
import { Heading1 } from '@/components/heading';
import { Checkbox } from '@/components/checkbox';
import { RoulettePhysics } from './roulette-physics/roulette-physics';
import { RouletteWheel } from './roulette-wheel/roulette-wheel';
import {
  RouletteInput,
  RouletteInputRef,
} from './roulette-input/roulette-input';
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

  const [excludePickedItem, setExcludePickedItem] = useState(false);
  const [tempSelectedItem, setTempSelectedItem] = useState<RouletteItem | null>(
    null,
  );

  const [showResult, setShowResult] = useState(false);
  const physicsRef = useRef<{ startSpin: () => void; stopSpin: () => void }>(
    null,
  );
  const inputRef = useRef<RouletteInputRef | null>(null);

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
    setTempSelectedItem(item);
    setState((prev) => ({ ...prev, selectedItem: item }));
    setShowResult(true);
  }, []);

  // 뽑힌 아이템을 제거하는 함수
  const handleRemovePickedItem = useCallback((itemId: string) => {
    // 룰렛 아이템 목록에서 제거
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));

    // 입력 필드에서도 제거
    if (inputRef.current) {
      inputRef.current.removePickedItemFromInput(itemId);
    }
  }, []);

  // 결과 모달 닫기
  const handleCloseResult = useCallback(() => {
    setShowResult(false);

    // excludePickedItem이 활성화되어 있고 선택된 아이템이 있으면 제거
    if (excludePickedItem && tempSelectedItem) {
      handleRemovePickedItem(tempSelectedItem.id);
    }

    setState((prev) => ({ ...prev, selectedItem: null }));
    setTempSelectedItem(null);
  }, [excludePickedItem, tempSelectedItem, handleRemovePickedItem]);

  return (
    <div className="flex-grow flex flex-col gap-16 mx-auto w-full max-w-screen-xl lg:flex-row">
      <div className="flex-1 flex flex-col gap-4">
        <Heading1>룰렛 돌리기</Heading1>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (state.isSpinning) {
              return;
            }
            setExcludePickedItem(!excludePickedItem);
          }}
        >
          <Checkbox checked={excludePickedItem} />
          <span className="text-sm text-text-subtitle">뽑힌 학생 제외하기</span>
        </div>
        <RouletteInput
          ref={inputRef}
          onItemsChange={handleItemsChange}
          disabled={state.isSpinning}
        />
      </div>

      <div className="sticky self-start lg:top-[20px] lg:pt-6 justify-center">
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
