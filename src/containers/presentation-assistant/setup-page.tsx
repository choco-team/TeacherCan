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
          className="absolute right-4 top-4 rounded-full p-1 transition-colors hover:bg-secondary"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      )}

      <div className="mb-6 flex items-center justify-center gap-2">
        {[1, 2].map((value) => (
          <div key={value} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                step >= value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {value}
            </div>
            {value < 2 && (
              <div
                className={`h-0.5 w-12 transition-colors ${
                  step > value ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
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
