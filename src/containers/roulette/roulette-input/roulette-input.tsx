'use client';

import {
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { XIcon, Database, Users } from 'lucide-react';
import { creatId } from '@/utils/createNanoid';
import StudentDataPicker from '@/components/student-data-picker';
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

interface Student {
  id: string;
  name: string;
}

export interface RouletteInputRef {
  removePickedItemFromInput: (itemId: string) => void;
}

export const RouletteInput = forwardRef<RouletteInputRef, RouletteInputProps>(
  ({ onItemsChange, disabled = false }, ref) => {
    const [inputFields, setInputFields] = useState<InputField[]>([
      { id: creatId(), name: '', weight: '1', color: ROULETTE_COLORS[0] },
    ]);
    const [autoGenerateNumber, setAutoGenerateNumber] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<'auto' | 'student'>(
      'auto',
    );
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

    // 빈 필드 추가 헬퍼 함수
    const addEmptyField = useCallback((fields: InputField[]): InputField[] => {
      const nextColorIndex = fields.length % ROULETTE_COLORS.length;
      return [
        ...fields,
        {
          id: creatId(),
          name: '',
          weight: '1',
          color: ROULETTE_COLORS[nextColorIndex],
        },
      ];
    }, []);

    // 자동 생성 함수
    const handleAutoGenerate = useCallback(() => {
      const number = parseInt(autoGenerateNumber, 10);
      if (number > 0 && number <= 50) {
        // 최대 50개로 제한
        const newFields: InputField[] = [];

        for (let i = 1; i <= number; i += 1) {
          const colorIndex = (i - 1) % ROULETTE_COLORS.length;
          newFields.push({
            id: creatId(),
            name: i.toString(),
            weight: '1',
            color: ROULETTE_COLORS[colorIndex],
          });
        }

        setInputFields(addEmptyField(newFields));
        setAutoGenerateNumber(''); // 입력 필드 초기화
        setIsModalOpen(false); // 모달 닫기
      }
    }, [autoGenerateNumber, addEmptyField]);

    const handleStudentDataGenerate = useCallback(
      (studentData: Student[]) => {
        const newFields: InputField[] = studentData.map((student, index) => {
          const colorIndex = index % ROULETTE_COLORS.length;
          return {
            id: creatId(),
            name: student.name,
            weight: '1',
            color: ROULETTE_COLORS[colorIndex],
          };
        });

        setInputFields(addEmptyField(newFields));
        setIsModalOpen(false); // 모달 닫기
      },
      [addEmptyField],
    );

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
        {/* 룰렛 항목 생성 섹션 */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              룰렛 항목 생성
            </h3>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="primary-outline"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  빠른 생성
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    빠른 생성
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* 라디오 버튼 선택 */}
                  <RadioGroup
                    value={selectedOption}
                    onValueChange={(value) =>
                      setSelectedOption(value as 'auto' | 'student')
                    }
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                      <RadioGroupItem
                        value="auto"
                        id="auto-option"
                        className="w-4 h-4 text-primary-500 border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                      />
                      <label
                        htmlFor="auto-option"
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                      >
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <Database className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">
                            자동 생성
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            숫자 범위로 자동 생성
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                      <RadioGroupItem
                        value="student"
                        id="student-option"
                        className="w-4 h-4 text-primary-500 border-gray-300 dark:border-gray-600 focus:ring-primary-500"
                      />
                      <label
                        htmlFor="student-option"
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                      >
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">
                            학생 데이터 가져오기
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            데이터베이스에서 가져오기
                          </p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>

                  {/* 자동 생성 UI */}
                  {selectedOption === 'auto' && (
                    <div className="">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                        <Database className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        자동 생성 설정
                      </h4>
                      <div className="space-y-3">
                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <label
                              htmlFor="modal-auto-generate-number"
                              className="block text-xs text-gray-700 dark:text-gray-300 mb-1 font-medium"
                            >
                              숫자 범위 (1 ~ 50)
                            </label>
                            <Input
                              id="modal-auto-generate-number"
                              type="number"
                              value={autoGenerateNumber}
                              onChange={(e) =>
                                setAutoGenerateNumber(e.target.value)
                              }
                              disabled={disabled}
                              min="1"
                              max="50"
                              placeholder="예: 30"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-sm"
                            />
                          </div>
                          <Button
                            onClick={handleAutoGenerate}
                            disabled={
                              disabled ||
                              !autoGenerateNumber ||
                              parseInt(autoGenerateNumber, 10) <= 0 ||
                              parseInt(autoGenerateNumber, 10) > 100
                            }
                            variant="primary"
                          >
                            생성
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          입력한 숫자만큼 1부터 N까지의 항목을 자동으로
                          생성합니다.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedOption === 'student' && (
                    <div className="">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        학생 데이터 가져오기
                      </h4>
                      <StudentDataPicker
                        buttonText="학생 데이터로 룰렛 생성"
                        onClickButton={handleStudentDataGenerate}
                      />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            빠른 생성 버튼을 클릭하여 룰렛 항목 생성 방법을 선택하세요.
          </p>
        </div>

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
                  <XIcon
                    size={12}
                    className="text-gray-100 dark:text-gray-900"
                  />
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
