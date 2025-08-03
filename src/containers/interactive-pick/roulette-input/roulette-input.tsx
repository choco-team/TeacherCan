'use client';

import { useState, useCallback } from 'react';
import { RouletteItem } from '../roulette-types';
import { ROULETTE_COLORS } from '../roulette-constants';

interface RouletteInputProps {
  onItemsChange: (items: RouletteItem[]) => void;
  disabled?: boolean;
}

export function RouletteInput({
  onItemsChange,
  disabled = false,
}: RouletteInputProps) {
  const [inputText, setInputText] = useState('');

  // 입력 텍스트를 파싱하여 룰렛 아이템 생성
  const parseInputText = useCallback((text: string): RouletteItem[] => {
    if (!text.trim()) return [];

    const lines = text.split('\n').filter((line) => line.trim());
    const items: RouletteItem[] = [];

    // 가중치를 포함한 아이템 정보 수집
    const weightedItems: Array<{ name: string; weight: number }> = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // 가중치 파싱 (*5, *10 등)
      const weightMatch = trimmedLine.match(/\*(\d+)$/);
      const weight = weightMatch ? parseInt(weightMatch[1], 10) : 1;
      const name = weightMatch
        ? trimmedLine.replace(/\*(\d+)$/, '').trim()
        : trimmedLine;

      if (name) {
        weightedItems.push({ name, weight });
      }
    });

    // 총 가중치 계산
    const totalWeight = weightedItems.reduce(
      (sum, item) => sum + item.weight,
      0,
    );

    // 가중치에 따른 각도 계산
    let currentAngle = 0;

    weightedItems.forEach((item, index) => {
      // 가중치에 비례한 각도 계산
      const anglePerWeight = (2 * Math.PI) / totalWeight;
      const itemAngle = anglePerWeight * item.weight;

      const startAngle = currentAngle;
      const endAngle = currentAngle + itemAngle;

      items.push({
        id: `item-${index}`,
        name: item.name,
        weight: item.weight,
        color: ROULETTE_COLORS[index % ROULETTE_COLORS.length],
        angle: (startAngle + endAngle) / 2,
        startAngle,
        endAngle,
      });

      currentAngle += itemAngle;
    });

    return items;
  }, []);

  // 입력 텍스트 변경 처리
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setInputText(text);

      const items = parseInputText(text);
      onItemsChange(items);
    },
    [parseInputText, onItemsChange],
  );

  // 예시 텍스트 설정
  const setExampleText = useCallback(() => {
    const exampleText = '짱구*5\n짱아*10\n봉미선*3';
    setInputText(exampleText);
    const items = parseInputText(exampleText);
    onItemsChange(items);
  }, [parseInputText, onItemsChange]);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          이름을 입력하세요
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          한 줄에 하나씩 입력하세요. *숫자로 가중치를 설정할 수 있습니다.
        </p>
      </div>

      <div className="relative">
        <textarea
          value={inputText}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder="예시:&#10;짱구*5&#10;짱아*10&#10;봉미선*3"
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />

        {!inputText && (
          <button
            type="button"
            onClick={setExampleText}
            className="absolute top-2 right-2 text-xs text-blue-500 hover:text-blue-700 underline"
          >
            예시 보기
          </button>
        )}
      </div>

      {inputText && (
        <div className="text-xs text-gray-500">
          <p>• 한 줄에 하나씩 입력하세요</p>
          <p>• *숫자로 가중치를 설정할 수 있습니다 (예: 짱구*5)</p>
          <p>• 가중치가 높을수록 뽑힐 확률이 높아집니다</p>
        </div>
      )}
    </div>
  );
}
