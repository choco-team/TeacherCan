'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Trash2, Clock, GripVertical } from 'lucide-react';
import { formatTime } from '../play-routine/utils/formatter';
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleActionChange = (value: string) => {
    onActivityChange(activity.id, 'action', value);
  };

  const handleChangeTimeInput = (value: string) => {
    // 숫자만 입력된 경우 mm:ss 형태로 자동 변환 (최대 4자리)
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 4);

    if (numericValue.length === 0) {
      // 빈 값인 경우 0초로 설정
      onActivityChange(activity.id, 'time', 0);
      return;
    }

    let minutes = 0;
    let seconds = 0;

    if (numericValue.length <= 2) {
      // 1-2자리: 초로 처리
      seconds = parseInt(numericValue, 10);
    } else {
      // 3-4자리: 앞 1-2자리는 분, 나머지는 초
      const minStr = numericValue.slice(0, -2);
      const secStr = numericValue.slice(-2);
      minutes = parseInt(minStr, 10);
      seconds = parseInt(secStr, 10);
    }

    const totalSeconds = minutes * 60 + seconds;
    onActivityChange(activity.id, 'time', totalSeconds);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 hover:shadow-md transition-all duration-200 border-gray-200 bg-white ${
        isDragging ? 'shadow-lg scale-[1.01]' : ''
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
          onChange={(e) => handleActionChange(e.target.value)}
          placeholder="활동 이름"
          className="flex-1 min-w-0 text-sm"
        />

        {/* 시간 입력 */}
        <div className="relative">
          <Input
            type="text"
            inputMode="numeric"
            value={formatTime(activity.time)}
            onChange={(event) => handleChangeTimeInput(event.target.value)}
            placeholder="00:00"
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
