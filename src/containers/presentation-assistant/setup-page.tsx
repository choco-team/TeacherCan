'use client';

import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { Label } from '@/components/label';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import StudentDataPicker from '@/components/student-data-picker';
import { PICK_TYPES } from '@/containers/random-pick/random-pick-constants';
import {
  InnerPickListType,
  PickType,
  Student,
} from '@/containers/random-pick/random-pick-type';
import SettingStudentName from '@/containers/random-pick/random-pick-list/random-pick-setting/setting-student-name/setting-student-name';
import SettingStudentNumber from '@/containers/random-pick/random-pick-list/random-pick-setting/setting-student-number/setting-student-number';
import {
  PresentationClassInfo,
  PresentationStudent,
} from '@/types/presentation-assistant';

interface SetupPageProps {
  onComplete: (classInfo: PresentationClassInfo) => void;
  onClose?: () => void;
}

const STEPS = [
  { value: 1, label: '발표 제목' },
  { value: 2, label: '학생 명단' },
];

export default function SetupPage({ onComplete, onClose }: SetupPageProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState('');
  const [pickType, setPickType] = useState<PickType>('numbers');

  const handleCompleteFromNames = (names: string[]) => {
    if (!title.trim() || names.length === 0) return;

    const students: PresentationStudent[] = names.map((name, index) => ({
      id: index + 1,
      nickname: name.length >= 2 ? name.slice(0, 2) : name,
      fullName: name,
      count: 0,
    }));

    onComplete({ title: title.trim(), students });
  };

  const handleCreateFromPickList = (
    _: PickType,
    pickList: InnerPickListType[],
  ) => {
    handleCompleteFromNames(pickList.map((item) => item.value));
  };

  const handleCreateFromStudentData = (studentData: Student[]) => {
    handleCompleteFromNames(studentData.map((student) => student.name));
  };

  return (
    <div className="relative rounded-2xl border border-border bg-card p-6 shadow-xl">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 transition-colors hover:bg-primary/10"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      )}

      {/* 스텝 인디케이터 */}
      <div className="mb-6 flex items-center justify-center gap-24">
        {STEPS.map(({ value, label }) => {
          const isActive = step === value;
          const isDone = step > value;

          return (
            <div key={value} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-black text-white'
                      : isDone
                        ? 'bg-gray-400 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {value}
                </div>
                <span
                  className={`mt-1 text-xs ${
                    isActive ? 'font-semibold text-black' : 'text-gray-500'
                  }`}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div>
          <h2 className="mb-1 text-lg font-bold text-foreground">발표 제목</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            발표를 구분할 수 있는 제목을 자유롭게 입력해 주세요.
          </p>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && title.trim()) setStep(2);
            }}
            placeholder="예: 3학년 2반 사회 발표"
            className="mb-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mb-6 text-xs text-muted-foreground">
            예) 3학년 4반 5월 9일 발표, 6학년 1반 과학 탐구 등
          </p>

          <button
            onClick={() => title.trim() && setStep(2)}
            disabled={!title.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-opacity disabled:opacity-40"
          >
            다음 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="mb-1 text-lg font-bold text-foreground">학생 명단</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            학생 명단을 만드는 방법을 선택해 주세요.
          </p>

          <div className="mb-6 flex flex-col gap-y-6">
            <RadioGroup className="flex gap-y-2">
              {PICK_TYPES.map(({ type, label }) => (
                <Label
                  key={type}
                  className="flex flex-1 items-center gap-x-1.5 text-text-title"
                >
                  <RadioGroupItem
                    value={type}
                    checked={pickType === type}
                    onClick={() => setPickType(type)}
                  />
                  {label}
                </Label>
              ))}
            </RadioGroup>

            {pickType === 'numbers' && (
              <SettingStudentNumber
                onCreateRandomPick={handleCreateFromPickList}
              />
            )}
            {pickType === 'names' && (
              <SettingStudentName
                onCreateRandomPick={handleCreateFromPickList}
              />
            )}
            {pickType === 'student-data' && (
              <StudentDataPicker
                buttonText="시작하기"
                onClickButton={handleCreateFromStudentData}
              />
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="rounded-xl border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-secondary"
            >
              이전
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
