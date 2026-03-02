import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Routine } from '../../create-routine/routine-types';
import { useTimer } from './use-timer';

export const usePlayRoutine = (routineId: string) => {
  const [routines] = useLocalStorage<Routine[]>('routines', []);
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    updateHours,
    updateMinutes,
    updateSeconds,
  } = useTimer();

  useEffect(() => {
    const loadRoutine = () => {
      try {
        if (Array.isArray(routines)) {
          const found = routines.find((r) => r.id === routineId);
          if (found && found.activities.length > 0) {
            setRoutine(found);
            setTimeValue(found.activities[0].time);
          }
        }
      } catch (error) {
        console.error('Failed to load routine', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoutine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routineId, routines, setTimeValue]);

  const currentActivity = routine?.activities[currentIndex] || null;

  useEffect(() => {
    if (!currentActivity || !routine) return;

    const originalTime = currentActivity.time;
    const progress =
      originalTime > 0 ? ((originalTime - timeLeft) / originalTime) * 100 : 100;
    setTotalProgress(progress);
  }, [timeLeft, currentActivity, routine]);

  useEffect(() => {
    if (!routine || !isRunning) return;

    if (timeLeft === 0) {
      const nextIndex = currentIndex + 1;

      stopTimer();

      const goNext = () => {
        if (nextIndex >= routine.activities.length) {
          setIsCompleted(true);
        } else {
          setCurrentIndex(nextIndex);
          const nextTime = routine.activities[nextIndex].time;
          setTimeValue(nextTime);

          setTimeout(() => {
            startTimer();
          }, 300);
        }
      };

      const audio = new Audio('/audio/timer/alarm/melody-1.mp3');
      audio.onended = goNext;
      audio.play().catch(goNext);
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

  const skipActivity = useCallback(() => {
    if (!routine) {
      return;
    }

    stopTimer();

    const nextIndex = currentIndex + 1;

    if (nextIndex >= routine.activities.length) {
      setIsCompleted(true);
    } else {
      setCurrentIndex(nextIndex);
      const nextTime = routine.activities[nextIndex].time;
      setTimeValue(nextTime);

      setTimeout(() => {
        startTimer();
      }, 0);
    }
  }, [routine, currentIndex, stopTimer, setTimeValue, startTimer]);

  const previousActivity = useCallback(() => {
    if (!routine || currentIndex <= 0) {
      return;
    }

    stopTimer();

    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    setTimeValue(routine.activities[prevIndex].time);
  }, [routine, currentIndex, stopTimer, setTimeValue]);

  const jumpToActivity = useCallback(
    (targetIndex: number) => {
      if (
        !routine ||
        targetIndex < 0 ||
        targetIndex >= routine.activities.length
      ) {
        return;
      }

      stopTimer();
      setCurrentIndex(targetIndex);
      const targetTime = routine.activities[targetIndex].time;
      setTimeValue(targetTime);
    },
    [routine, stopTimer, setTimeValue],
  );

  const restartRoutine = useCallback(() => {
    if (!routine) return;

    setCurrentIndex(0);
    setTimeValue(routine.activities[0].time);
    setIsCompleted(false);

    startTimer();
  }, [routine, startTimer, setTimeValue]);

  const exitTimer = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  return {
    routine,
    isLoading,
    currentActivity,
    currentIndex,
    timeLeft,
    totalProgress,
    isRunning,
    isPaused,
    isCompleted,
    startTimer,
    pauseTimer,
    resumeTimer,
    skipActivity,
    jumpToActivity,
    previousActivity,
    restartRoutine,
    exitTimer,
    setTimeValue,
    stopTimer,
    updateHours,
    updateMinutes,
    updateSeconds,
  };
};
