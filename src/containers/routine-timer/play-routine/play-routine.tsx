'use client';

import { useEffect, useState } from 'react';
import { RoutineItem } from '../create-routine/routine-types';

interface RoutineTimerProps {
  routines: RoutineItem[];
  onFinish: () => void;
}

function PlayRoutine({ routines, onFinish }: RoutineTimerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(routines[0]?.duration || 0);
  const currentRoutine = routines[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (currentIndex < routines.length - 1) {
            // 다음 루틴으로 이동
            setCurrentIndex((prevIndex) => prevIndex + 1);
            return routines[currentIndex + 1].duration;
          }
          // 모든 루틴 완료
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  if (!currentRoutine) return <div>루틴이 없습니다.</div>;

  return (
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-bold">{currentRoutine.title}</h2>
      <p className="text-lg">{currentRoutine.description}</p>
      <div className="text-5xl font-mono">{formatTime(secondsLeft)}</div>
      <p className="text-sm text-gray-500">
        {currentIndex + 1} / {routines.length} 번째 활동
      </p>
    </div>
  );
}

export default PlayRoutine;
