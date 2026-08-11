'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  BookOpen,
  AlertCircle,
  X,
} from 'lucide-react';
import { Button } from '@/components/button';
import { Heading3 } from '@/components/heading';

export interface SetupData {
  roomName: string;
  startDate: string;
  endDate: string;
  location: string;
  classes: string[];
}

interface SetupPageProps {
  initialData?: SetupData;
  buttonText: string;
  onComplete: (data: SetupData) => void;
}

export default function SetupPage({
  initialData,
  buttonText,
  onComplete,
}: SetupPageProps) {
  // 상태 관리
  const [roomName, setRoomName] = useState(initialData?.roomName || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [location, setLocation] = useState(initialData?.location || '');

  const [classes, setClasses] = useState<string[]>(initialData?.classes || []);
  const [classInput, setClassInput] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setRoomName(initialData.roomName);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setLocation(initialData.location);
      setClasses(initialData.classes);
    } else {
      setRoomName('');
      setStartDate('');
      setEndDate('');
      setLocation('');
      setClasses([]);
    }
    setErrorMsg('');
    setClassInput('');
  }, [initialData]);

  const handleAddClass = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newClass = classInput.trim();
      if (newClass && !classes.includes(newClass)) {
        setClasses([...classes, newClass]);
        setClassInput('');
      } else if (classes.includes(newClass)) {
        setErrorMsg('이미 추가된 학급입니다.');
      }
    }
  };

  const handleRemoveClass = (classToRemove: string) => {
    setClasses(classes.filter((c) => c !== classToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!roomName || !startDate || !endDate) {
      setErrorMsg('장소를 제외한 모든 항목을 입력해주세요.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setErrorMsg(
        '🚨 종료일이 시작일보다 빠를 수 없습니다! 날짜를 다시 확인해주세요.',
      );
      return;
    }

    if (classes.length === 0) {
      setErrorMsg('참여 학급을 최소 하나 이상 추가해주세요.');
      return;
    }

    onComplete({
      roomName,
      startDate,
      endDate,
      location,
      classes,
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 border-b border-border pb-4">
        <Heading3 className="text-primary">시간표 기본 설정</Heading3>
        <p className="mt-1 text-sm text-muted-foreground">
          시간표의 이름, 운영 기간, 장소, 참여 학급을 설정합니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* 시간표 이름 */}
          <div className="space-y-2 text-left">
            {/* 💡 에러 픽스: htmlFor 추가 */}
            <label
              htmlFor="roomName"
              className="flex items-center gap-1.5 text-sm font-semibold text-text-title"
            >
              <BookOpen className="h-4 w-4 text-primary" />
              수업명 (시간표 이름) <span className="text-destructive">*</span>
            </label>
            <input
              id="roomName" // 💡 에러 픽스: id 추가
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="예: 4학년 국악, 전학년 생존수영"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-title outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* 장소 */}
          <div className="space-y-2 text-left">
            {/* 💡 에러 픽스: htmlFor 추가 */}
            <label
              htmlFor="location"
              className="flex items-center gap-1.5 text-sm font-semibold text-text-title"
            >
              <MapPin className="h-4 w-4 text-primary" />
              기본 장소{' '}
              <span className="text-xs font-normal text-muted-foreground">
                (선택)
              </span>
            </label>
            <input
              id="location" // 💡 에러 픽스: id 추가
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 음악실, 강당"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-title outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* 운영 기간 */}
          <div className="col-span-1 md:col-span-2 space-y-2 text-left">
            {/* 💡 에러 픽스: htmlFor 추가 */}
            <label
              htmlFor="startDate"
              className="flex items-center gap-1.5 text-sm font-semibold text-text-title"
            >
              <Calendar className="h-4 w-4 text-primary" />
              운영 기간 <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="startDate" // 💡 에러 픽스: id 추가
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate && e.target.value > endDate) {
                    setEndDate('');
                  }
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-title outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="text-muted-foreground">~</span>
              <input
                id="endDate" // 💡 에러 픽스: id 추가
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-title outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* 참여 학급 태그 입력 영역 */}
          <div className="col-span-1 md:col-span-2 space-y-2 text-left">
            {/* 💡 에러 픽스: htmlFor 추가 */}
            <label
              htmlFor="classInput"
              className="flex items-center gap-1.5 text-sm font-semibold text-text-title"
            >
              <Users className="h-4 w-4 text-primary" />
              참여 대상 학급 <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="classInput" // 💡 에러 픽스: id 추가
                type="text"
                value={classInput}
                onChange={(e) => {
                  setClassInput(e.target.value);
                  setErrorMsg('');
                }}
                onKeyDown={handleAddClass}
                placeholder="반 입력 후 Enter (예: 3-1)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-title outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <Button
                type="button"
                variant="gray-outline"
                onClick={() => {
                  if (
                    classInput.trim() &&
                    !classes.includes(classInput.trim())
                  ) {
                    setClasses([...classes, classInput.trim()]);
                    setClassInput('');
                  }
                }}
              >
                추가
              </Button>
            </div>

            {classes.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {classes.map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary-700 dark:text-primary-300"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => handleRemoveClass(c)}
                      className="ml-1 rounded-full p-0.5 hover:bg-primary/20 hover:text-primary-800 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {/* 💡 에러 픽스: 작은 따옴표(')를 &apos;로 변경 */}
              이곳에 추가한 반 목록이 배정 달력의 &apos;드롭다운&apos; 목록으로
              나타납니다.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" className="px-8">
            {buttonText}
          </Button>
        </div>
      </form>
    </div>
  );
}
