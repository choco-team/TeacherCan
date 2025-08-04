'use client';

import {
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Input } from '@/components/input';
import { XIcon } from 'lucide-react';
import { creatId } from '@/utils/createNanoid';
import { RouletteItem } from '../roulette-types';
import { ROULETTE_COLORS } from '../roulette-constants';

interface RouletteInputProps {
  onItemsChange: (items: RouletteItem[]) => void;
  disabled?: boolean;
}

interface InputField {
  id: string;
  name: string;
  weight: string;
  color: string; // 색상을 필드에 저장
}

export interface RouletteInputRef {
  removePickedItemFromInput: (itemId: string) => void;
}

export const RouletteInput = forwardRef<RouletteInputRef, RouletteInputProps>(
  ({ onItemsChange, disabled = false }, ref) => {
    const [inputFields, setInputFields] = useState<InputField[]>([
      { id: creatId(), name: '', weight: '1', color: ROULETTE_COLORS[0] },
    ]);

    // 입력 필드들을 파싱하여 룰렛 아이템 생성
    const parseInputFields = useCallback(
      (fields: InputField[]): RouletteItem[] => {
        const validFields = fields.filter(
          (field) => field.name.trim() && field.weight.trim(),
        );

        if (validFields.length === 0) return [];

        const items: RouletteItem[] = [];
        const weightedItems: Array<{
          id: string;
          name: string;
          weight: number;
          color: string;
        }> = [];

        validFields.forEach((field) => {
          const weight = parseInt(field.weight, 10) || 1;
          weightedItems.push({
            id: field.id,
            name: field.name.trim(),
            weight,
            color: field.color,
          });
        });

        // 총 가중치 계산
        const totalWeight = weightedItems.reduce(
          (sum, item) => sum + item.weight,
          0,
        );

        // 가중치에 따른 각도 계산
        let currentAngle = 0;

        weightedItems.forEach((item) => {
          // 가중치에 비례한 각도 계산
          const anglePerWeight = (2 * Math.PI) / totalWeight;
          const itemAngle = anglePerWeight * item.weight;

          const startAngle = currentAngle;
          const endAngle = currentAngle + itemAngle;

          items.push({
            id: item.id,
            name: item.name,
            weight: item.weight,
            color: item.color,
            angle: (startAngle + endAngle) / 2,
            startAngle,
            endAngle,
          });

          currentAngle += itemAngle;
        });

        return items;
      },
      [],
    );

    // 입력 필드 변경 처리
    const handleFieldChange = useCallback(
      (id: string, fieldType: 'name' | 'weight', value: string) => {
        setInputFields((prev) => {
          const updated = prev.map((inputField) =>
            inputField.id === id
              ? { ...inputField, [fieldType]: value }
              : inputField,
          );

          // 마지막 필드에 이름이 입력되면 새로운 필드 추가
          if (fieldType === 'name' && id === updated[updated.length - 1].id) {
            if (value.trim()) {
              // 다음 색상 인덱스 계산
              const nextColorIndex = updated.length % ROULETTE_COLORS.length;
              updated.push({
                id: creatId(),
                name: '',
                weight: '1',
                color: ROULETTE_COLORS[nextColorIndex],
              });
            }
          }

          return updated;
        });
      },
      [],
    );

    // 입력 필드 삭제
    const handleRemoveField = useCallback(
      (id: string) => {
        if (disabled) {
          return;
        }

        setInputFields((prev) => {
          const filtered = prev.filter((field) => field.id !== id);
          // 최소 하나의 필드는 유지
          return filtered.length > 0
            ? filtered
            : [
                {
                  id: creatId(),
                  name: '',
                  weight: '1',
                  color: ROULETTE_COLORS[0],
                },
              ];
        });
      },
      [disabled],
    );

    // 뽑힌 아이템을 입력 필드에서 제거하는 함수
    const removePickedItemFromInput = useCallback((itemId: string) => {
      setInputFields((prev) => {
        const filtered = prev.filter((field) => field.id !== itemId);
        // 최소 하나의 필드는 유지
        return filtered.length > 0
          ? filtered
          : [
              {
                id: creatId(),
                name: '',
                weight: '1',
                color: ROULETTE_COLORS[0],
              },
            ];
      });
    }, []);

    // ref를 통해 외부에서 호출할 수 있는 함수들 노출
    useImperativeHandle(
      ref,
      () => ({
        removePickedItemFromInput,
      }),
      [removePickedItemFromInput],
    );

    // 입력 필드가 변경될 때마다 룰렛 아이템 업데이트
    useEffect(() => {
      const items = parseInputFields(inputFields);
      onItemsChange(items);
    }, [inputFields, parseInputFields, onItemsChange]);

    return (
      <div className="w-full pr-4 lg:pr-0">
        <div className="space-y-2 pr-4 lg:pr-0">
          <div className="flex gap-2">
            <div className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </span>
            </div>
            <div className="w-20">
              <span className="block text-sm font-medium text-gray-700 mb-1">
                가중치
              </span>
            </div>
          </div>

          {inputFields.map((field) => (
            <div key={field.id} className="relative pr-4 lg:pr-0">
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input
                    value={field.name}
                    onChange={(e) =>
                      handleFieldChange(field.id, 'name', e.target.value)
                    }
                    disabled={disabled}
                    placeholder="이름 입력"
                    className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    value={field.weight}
                    onChange={(e) =>
                      handleFieldChange(field.id, 'weight', e.target.value)
                    }
                    disabled={disabled}
                    min="1"
                    placeholder="가중치"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              {inputFields.indexOf(field) !== inputFields.length - 1 && (
                <div
                  className="absolute top-1/2 right-[-28px] transform -translate-y-1/2 cursor-pointer bg-gray-300 rounded-full p-1"
                  onClick={() => handleRemoveField(field.id)}
                >
                  <XIcon size={12} className="text-gray-100" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
);

RouletteInput.displayName = 'RouletteInput';
