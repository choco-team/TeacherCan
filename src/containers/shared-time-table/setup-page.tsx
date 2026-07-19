'use client';

import { useState } from 'react';
import { Plus, X, ArrowRight } from 'lucide-react';
import { Heading2 } from '@/components/heading';
import { Button } from '@/components/button';
import { Label } from '@/components/label';
import { Input } from '@/components/input';

interface SetupPageProps {
  onComplete: (setupData: { roomName: string; classes: string[] }) => void;
}

export default function SetupPage({ onComplete }: SetupPageProps) {
  const [roomName, setRoomName] = useState('');
  const [classInput, setClassInput] = useState('');
  const [classList, setClassList] = useState<string[]>([]);

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
    if (!roomName.trim() || classList.length === 0) return;
    onComplete({ roomName, classes: classList });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-8">
        <Heading2 className="mb-1">기본 환경 세팅</Heading2>
        <p className="text-sm text-muted-foreground">
          시간표 이름과 참여할 학급을 등록해 주세요.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. 방 이름 설정 */}
        <div>
          {/* 👇 Label 컴포넌트 적용 (required 추가) */}
          <Label
            className="mb-2 block text-sm font-semibold text-text-title"
            required
          >
            시간표 이름
          </Label>
          {/* 👇 Input 컴포넌트 적용 (기존의 큼직한 높이와 둥근 테두리 유지) */}
          <Input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="예) 2026학년도 1학기 전담 시간표"
            className="h-12 rounded-xl px-4 text-sm"
          />
        </div>

        {/* 2. 반 등록 설정 */}
        <div>
          {/* 👇 Label 컴포넌트 적용 (required 추가) */}
          <Label
            className="mb-2 block text-sm font-semibold text-text-title"
            required
          >
            참여 학급 등록
          </Label>
          <div className="flex gap-2">
            {/* 👇 Input 컴포넌트 적용 */}
            <Input
              type="text"
              value={classInput}
              onChange={(e) => setClassInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
              placeholder="예) 6-1"
              className="flex-1 h-12 rounded-xl px-4 text-sm"
            />
            <Button
              onClick={handleAddClass}
              variant="primary"
              size="icon"
              className="h-12 w-12 shrink-0 rounded-xl"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* 등록된 반 목록 표시 */}
          {classList.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4">
              {classList.map((className) => (
                <span
                  key={className}
                  className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-sm font-medium text-text-title border border-border shadow-sm"
                >
                  {className}
                  <button
                    onClick={() => handleRemoveClass(className)}
                    className="text-muted-foreground transition-colors hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 완료 버튼 */}
      <div className="mt-10 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!roomName.trim() || classList.length === 0}
          variant="primary"
          size="lg"
          className="flex items-center gap-2 rounded-xl h-12"
        >
          시간표 짜기
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
