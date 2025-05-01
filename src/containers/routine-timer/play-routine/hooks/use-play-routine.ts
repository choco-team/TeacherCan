import { useState, useEffect, useCallback } from 'react';
import { Routine } from '../../create-routine/routine-types';
import { formatTime } from '../utils/time-formatter';
import { useTimer } from './use-timer';

export const usePlayRoutine = (routineId: string) => {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    timeLeft,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    setTimeValue,
  } = useTimer();

  useEffect(() => {
    const loadRoutine = () => {
      try {
        const saved = localStorage.getItem('routines');
        if (saved) {
          const routines: Routine[] = JSON.parse(saved);
          const found = routines.find((r) => r.key === routineId);
          if (found && found.routine.length > 0) {
            setRoutine(found);
            setTimeValue(found.routine[0].time);
            // 루틴이 로드되면 바로 타이머 시작
            startTimer();
          }
        }
      } catch (error) {
        console.error('Failed to load routine', error);
      }
    };

    loadRoutine();
  }, [routineId, setTimeValue, startTimer]);

  // 현재 활동 계산
  const currentActivity = routine?.routine[currentIndex] || null;

  // 진행률 계산
  useEffect(() => {
    if (!currentActivity || !routine) return;

    const originalTime = currentActivity.time;
    const progress = ((originalTime - timeLeft) / originalTime) * 100;
    setTotalProgress(progress);
  }, [timeLeft, currentActivity, routine]);

  // 타이머 콜백 설정
  useEffect(() => {
    if (!routine || !isRunning) return;

    // timeLeft가 0이 되면 다음 활동으로 이동
    if (timeLeft === 0) {
      const nextIndex = currentIndex + 1;

      if (nextIndex >= routine.routine.length) {
        // 모든 활동 완료
        stopTimer();
        setIsCompleted(true);
      } else {
        // 다음 활동으로 이동
        setCurrentIndex(nextIndex);
        const nextTime = routine.routine[nextIndex].time;
        setTimeValue(nextTime);

        // 중요: 타이머를 명시적으로 재시작
        setTimeout(() => {
          startTimer();
        }, 0);
      }
    }
  }, [
    timeLeft,
    isRunning,
    currentIndex,
    routine,
    stopTimer,
    setTimeValue,
    startTimer,
  ]);

  // 활동 건너뛰기
  const skipActivity = useCallback(() => {
    if (!routine) return;

    // 현재 타이머 정지
    stopTimer();

    const nextIndex = currentIndex + 1;

    if (nextIndex >= routine.routine.length) {
      // 모든 활동 완료
      setIsCompleted(true);
    } else {
      // 다음 활동으로 이동
      setCurrentIndex(nextIndex);
      setTimeValue(routine.routine[nextIndex].time);

      // 타이머 명시적 재시작 (setTimeout으로 상태 업데이트가 완료된 후 실행)
      setTimeout(() => {
        startTimer();
      }, 0);
    }
  }, [routine, currentIndex, stopTimer, setTimeValue, startTimer]);

  // 루틴 다시 시작
  const restartRoutine = useCallback(() => {
    if (!routine) return;

    setCurrentIndex(0);
    setTimeValue(routine.routine[0].time);
    setIsCompleted(false);

    // 타이머 재시작
    startTimer();
  }, [routine, startTimer, setTimeValue]);

  // 타이머 종료
  const exitTimer = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  return {
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
  };
};
