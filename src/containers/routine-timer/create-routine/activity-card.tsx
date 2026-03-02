'use client';

import { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Trash2, Clock, GripVertical } from 'lucide-react';
import { formatSecondsToTime } from '../play-routine/utils/formatter';
import { Activity } from './routine-types';

interface ActivityCardProps {
  activity: Activity;
  onActivityChange: (
    activityId: string,
    field: 'action' | 'time',
    value: string | number,
  ) => void;
  onRemove: (activityId: string) => void;
}

export function ActivityCard({
  activity,
  onActivityChange,
  onRemove,
}: ActivityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const [timeInput, setTimeInput] = useState(
    formatSecondsToTime(activity.time),
  );
  const isInternalChange = useRef(false);

  // 외부에서 activity.time이 변경될 때만 동기화 (내부 변경은 무시)
  useEffect(() => {
    if (!isInternalChange.current) {
      setTimeInput(formatSecondsToTime(activity.time));
    }
    isInternalChange.current = false;
  }, [activity.time]);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleChangeTimeInput = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 4);

    if (numericValue.length === 0) {
      setTimeInput('');
      isInternalChange.current = true;
      onActivityChange(activity.id, 'time', 0);
      return;
    }

    // mm:ss 포맷 적용 및 초 계산
    let minutes = 0;
    let seconds = 0;

    if (numericValue.length <= 2) {
      seconds = parseInt(numericValue, 10);
    } else if (numericValue.length === 3) {
      minutes = parseInt(numericValue[0], 10);
      seconds = parseInt(numericValue.slice(1), 10);
    } else {
      minutes = parseInt(numericValue.slice(0, 2), 10);
      seconds = parseInt(numericValue.slice(2), 10);
    }

    const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    setTimeInput(formatted);

    isInternalChange.current = true;
    onActivityChange(activity.id, 'time', minutes * 60 + seconds);
  };

  const handleBlurTimeInput = () => {
    // blur 시 초가 60 이상이면 정규화
    setTimeInput(formatSecondsToTime(activity.time));
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 border-gray-200 bg-white ${
        isDragging
          ? 'opacity-40 border-dashed'
          : 'hover:shadow-md transition-all duration-200'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* 드래그 핸들 */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>

        {/* 순서 번호 */}
        <div className="flex items-center justify-center size-7 bg-gradient-to-br from-primary-300 to-primary-500 text-white rounded-full text-xs font-bold shadow-sm">
          {activity.order}
        </div>

        {/* 활동 이름 */}
        <Input
          type="text"
          value={activity.action}
          onChange={(e) =>
            onActivityChange(activity.id, 'action', e.target.value)
          }
          placeholder="활동 이름"
          className="flex-1 min-w-0 text-sm"
        />

        {/* 시간 입력 */}
        <div className="relative">
          <Input
            type="text"
            inputMode="numeric"
            value={timeInput}
            onChange={(event) => handleChangeTimeInput(event.target.value)}
            onBlur={handleBlurTimeInput}
            placeholder="0:00"
            className="w-[5.5rem] text-end text-sm font-mono"
          />
          <Clock className="size-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>

        {/* 삭제 버튼 */}
        <Button
          variant="gray-ghost"
          size="sm"
          onClick={() => onRemove(activity.id)}
          className="text-red-500 hover:text-red-700 active:text-red-700 hover:bg-red-50 active:bg-red-50 size-8 p-1 rounded-full transition-colors"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
