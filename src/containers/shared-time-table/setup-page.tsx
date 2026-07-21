'use client';

import { useState } from 'react';
import { Plus, X, ArrowRight } from 'lucide-react';
import { Heading3 } from '@/components/heading';
import { Button } from '@/components/button';
import { Label } from '@/components/label';
import { Input } from '@/components/input';

interface SetupData {
  roomName: string;
  classes: string[];
  location: string;
  startDate: string;
  endDate: string;
}

interface SetupPageProps {
  initialData?: SetupData;
  buttonText?: string;
  onComplete: (setupData: SetupData) => void;
}

export default function SetupPage({
  initialData,
  buttonText = '시간표 짜기',
  onComplete,
}: SetupPageProps) {
  const [roomName, setRoomName] = useState(initialData?.roomName || '');
  const [classInput, setClassInput] = useState('');
  const [classList, setClassList] = useState<string[]>(
    initialData?.classes || [],
  );

  // 💡 장소와 날짜 상태 추가
  const [location, setLocation] = useState(initialData?.location || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');

  const handleAddClass = () => {
    const trimmedInput = classInput.trim();
    if (!trimmedInput) return;

    if (!classList.includes(trimmedInput)) {
      setClassList([...classList, trimmedInput]);
    }
    setClassInput('');
  };

  const handleRemoveClass = (targetClass: string) => {
    setClassList(classList.filter((c) => c !== targetClass));
  };

  const handleSubmit = () => {
    if (!roomName.trim() || classList.length === 0 || !startDate || !endDate)
      return;
    onComplete({ roomName, classes: classList, location, startDate, endDate });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
        <div>
          <Heading3 className="mb-1">시간표 기본 세팅</Heading3>
          <p className="text-xs text-muted-foreground">
            공통으로 적용될 시간표 정보와 참여 학급을 등록하세요.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={
            !roomName.trim() || classList.length === 0 || !startDate || !endDate
          }
          variant="primary"
          size="sm"
          className="gap-2"
        >
          {buttonText}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 1. 방 이름 (수업명) */}
        <div>
          <Label
            className="mb-2 block text-xs font-semibold text-text-title"
            required
          >
            수업명 (시간표 이름)
          </Label>
          <Input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="예: 3~4학년 국악"
            className="h-10 text-sm"
          />
        </div>

        {/* 2. 장소 */}
        <div>
          <Label className="mb-2 block text-xs font-semibold text-text-title">
            장소 및 강사 (선택)
          </Label>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="예: 음악실 (김국악)"
            className="h-10 text-sm"
          />
        </div>

        {/* 3. 기간 */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label
              className="mb-2 block text-xs font-semibold text-text-title"
              required
            >
              시작일
            </Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 text-sm px-2"
            />
          </div>
          <div className="flex-1">
            <Label
              className="mb-2 block text-xs font-semibold text-text-title"
              required
            >
              종료일
            </Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 text-sm px-2"
            />
          </div>
        </div>

        {/* 4. 반 등록 */}
        <div className="md:col-span-2 lg:col-span-3 border-t border-border pt-4">
          <Label
            className="mb-2 block text-xs font-semibold text-text-title"
            required
          >
            참여 학급 등록
          </Label>
          <div className="flex gap-2 max-w-sm">
            <Input
              type="text"
              value={classInput}
              onChange={(e) => setClassInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
              placeholder="예) 3-1"
              className="h-10 flex-1 text-sm"
            />
            <Button
              onClick={handleAddClass}
              variant="primary"
              size="icon"
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {classList.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3">
              {classList.map((className) => (
                <span
                  key={className}
                  className="inline-flex items-center gap-1 rounded-md bg-background px-2 py-1 text-xs font-medium text-text-title border border-border shadow-sm"
                >
                  {className}
                  <button
                    onClick={() => handleRemoveClass(className)}
                    className="text-muted-foreground transition-colors hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
