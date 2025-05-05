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

            startTimer();
          }
        }
      } catch (error) {
        console.error('Failed to load routine', error);
      }
    };

    loadRoutine();
  }, [routineId, setTimeValue, startTimer]);

  const currentActivity = routine?.routine[currentIndex] || null;

  useEffect(() => {
    if (!currentActivity || !routine) return;

    const originalTime = currentActivity.time;
    const progress = ((originalTime - timeLeft) / originalTime) * 100;
    setTotalProgress(progress);
  }, [timeLeft, currentActivity, routine]);

  useEffect(() => {
    if (!routine || !isRunning) return;

    if (timeLeft === 0) {
      const nextIndex = currentIndex + 1;

      if (nextIndex >= routine.routine.length) {
        stopTimer();
        setIsCompleted(true);
      } else {
        setCurrentIndex(nextIndex);
        const nextTime = routine.routine[nextIndex].time;
        setTimeValue(nextTime);

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
    currentActivity,
  ]);

  const skipActivity = useCallback(() => {
    if (!routine) {
      return;
    }

    stopTimer();

    const nextIndex = currentIndex + 1;

    if (nextIndex >= routine.routine.length) {
      setIsCompleted(true);
    } else {
      setCurrentIndex(nextIndex);
      const nextTime = routine.routine[nextIndex].time;
      setTimeValue(nextTime);

      setTimeout(() => {
        startTimer();
      }, 0);
    }
  }, [routine, currentIndex, stopTimer, setTimeValue, startTimer]);

  const restartRoutine = useCallback(() => {
    if (!routine) return;

    setCurrentIndex(0);
    setTimeValue(routine.routine[0].time);
    setIsCompleted(false);

    startTimer();
  }, [routine, startTimer, setTimeValue]);

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
