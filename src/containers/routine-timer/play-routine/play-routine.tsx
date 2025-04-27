'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { useEffect } from 'react';
import { Play, Pause, SkipForward, Clock, X } from 'lucide-react';
import { usePlayRoutine } from './use-play-routine';

type PlayRoutineProps = {
  routineId: string;
};

export default function PlayRoutine({ routineId }: PlayRoutineProps) {
  const router = useRouter();

  const {
    routine,
    currentActivity,
    currentIndex,
    timeLeft,
    totalProgress,
    isRunning,
    isPaused,
    isCompleted,
    formatTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    skipActivity,
    restartRoutine,
    exitTimer,
  } = usePlayRoutine(routineId);

  useEffect(() => {
    // 최초 1회 타이머 시작
    if (!isRunning && !isPaused && !isCompleted) {
      startTimer();
    }
  }, [isRunning, isPaused, isCompleted, startTimer]);

  const handleExit = () => {
    exitTimer();
    router.push(`/routine-timer/${routineId}`);
  };

  if (!routine) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-2xl text-gray-500 mb-4">루틴을 찾을 수 없습니다</p>
        <Button
          onClick={() => router.push('/routine-timer')}
          className="bg-primary-500 text-white px-4 py-2 rounded"
        >
          돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">{routine.title}</h1>
          <span className="ml-4 text-gray-500">
            {currentIndex + 1}/{routine.routine.length}
          </span>
        </div>
        <Button
          onClick={handleExit}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </Button>
      </div>

      {isCompleted ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-6">루틴 완료!</h2>
          <div className="flex gap-4">
            <Button
              onClick={restartRoutine}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg"
            >
              다시 시작
            </Button>
            <Button
              onClick={handleExit}
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg"
            >
              종료
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col items-center justify-center">
            {currentActivity && (
              <>
                <h2 className="text-5xl font-bold mb-6">
                  {currentActivity.action || `활동 ${currentIndex + 1}`}
                </h2>
                <div className="text-7xl font-bold mb-10">
                  {formatTime(timeLeft)}
                </div>

                <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mb-10">
                  <div
                    className="bg-primary-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>

                <div className="flex gap-4">
                  {isPaused ? (
                    <Button
                      onClick={resumeTimer}
                      className="bg-green-500 text-white p-4 rounded-full"
                    >
                      <Play size={24} />
                    </Button>
                  ) : (
                    <Button
                      onClick={pauseTimer}
                      className="bg-yellow-500 text-white p-4 rounded-full"
                    >
                      <Pause size={24} />
                    </Button>
                  )}

                  <Button
                    onClick={skipActivity}
                    className="bg-blue-500 text-white p-4 rounded-full"
                  >
                    <SkipForward size={24} />
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">다음 활동</h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {routine.routine
                .slice(currentIndex + 1, currentIndex + 4)
                .map((activity, idx) => (
                  <div
                    key={`activity-${currentIndex + idx + 1}-${activity.action || 'unnamed'}`}
                    className="flex-shrink-0 w-32 h-24 bg-primary-100 rounded-lg p-3 flex flex-col justify-between"
                  >
                    <div className="text-sm font-medium truncate">
                      {activity.action || `활동 ${currentIndex + idx + 2}`}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={14} className="mr-1" />
                      {formatTime(activity.time)}
                    </div>
                  </div>
                ))}

              {currentIndex + 1 >= routine.routine.length && (
                <div className="flex-shrink-0 w-32 h-24 bg-green-100 rounded-lg p-3 flex flex-col justify-between">
                  <div className="text-sm font-medium truncate">완료</div>
                  <div className="text-xs text-gray-500">마지막 활동입니다</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
