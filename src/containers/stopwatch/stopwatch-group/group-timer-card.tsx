'use client';

import { Card, CardHeader, CardTitle } from '@/components/card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { GroupTimer } from '../stopwatch-type';
import { formatTime } from '../stopwatch-utils';
import { useGroupStopwatchAction } from './stopwatch-group-provider.hooks';

interface GroupTimerCardProps {
  timer: GroupTimer;
  minHeightClass?: string;
  timerSizeClass?: string;
}

export default function GroupTimerCard({
  timer,
  minHeightClass,
  timerSizeClass,
}: GroupTimerCardProps) {
  const { startTimer, pauseTimer, resetTimer } = useGroupStopwatchAction();

  const handleStartPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timer.isRunning) {
      pauseTimer(timer.id);
    } else {
      startTimer(timer.id);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetTimer(timer.id);
  };

  const handleCardClick = () => {
    if (timer.isRunning) {
      pauseTimer(timer.id);
    } else {
      startTimer(timer.id);
    }
  };

  return (
    <Card
      className={`relative overflow-hidden group cursor-pointer transition-all hover:shadow-lg flex flex-col ${minHeightClass || ''}`}
      style={{ borderLeftColor: timer.color, borderLeftWidth: '4px' }}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-lg truncate" style={{ color: timer.color }}>
          {timer.name}
        </CardTitle>
      </CardHeader>
      {/* 호버 시 나타나는 오버레이 및 아이콘 */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10 rounded-xl">
        <div
          onClick={handleStartPause}
          className="flex items-center justify-center w-20 h-20 rounded-full bg-white/90 hover:bg-white transition-colors cursor-pointer shadow-lg"
        >
          {timer.isRunning ? (
            <Pause className="size-10 text-text-title" />
          ) : (
            <Play className="size-10 text-text-title ml-1" />
          )}
        </div>
      </div>

      {/* 초기화 버튼 - 오른쪽 하단 */}
      <button
        type="button"
        onClick={handleReset}
        className="absolute bottom-2 right-2 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-20 opacity-60 hover:opacity-100"
        aria-label="초기화"
      >
        <RotateCcw className="size-3.5 text-text-subtitle" />
      </button>

      {/* 타이머 숫자 - absolute로 중앙 배치 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div
            className={`font-mono font-bold text-text-title ${timerSizeClass || 'text-3xl'}`}
          >
            {formatTime(timer.time)}
          </div>
        </div>
      </div>
    </Card>
  );
}
