import { useState, useEffect, useCallback, useRef } from 'react';
import { Routine } from '../create-routine/routine-types';

export const usePlayRoutine = (routineId: string) => {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // 타이머 ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 최신 상태값을 ref에 저장하여 클로저 문제 해결
  const routineRef = useRef<Routine | null>(null);
  const currentIndexRef = useRef<number>(0);
  const timeLeftRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);

  // ref 값 동기화
  useEffect(() => {
    routineRef.current = routine;
    currentIndexRef.current = currentIndex;
    timeLeftRef.current = timeLeft;
    isRunningRef.current = isRunning;
  }, [routine, currentIndex, timeLeft, isRunning]);

  // 루틴 데이터 로드
  useEffect(() => {
    const loadRoutine = () => {
      try {
        const saved = localStorage.getItem('routines');
        if (saved) {
          const routines: Routine[] = JSON.parse(saved);
          const found = routines.find((r) => r.key === routineId);
          if (found && found.routine.length > 0) {
            setRoutine(found);
            setTimeLeft(found.routine[0].time);
          }
        }
      } catch (error) {
        console.error('Failed to load routine', error);
      }
    };

    loadRoutine();
    return () => {
      // 정리 함수에서 타이머 제거
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [routineId]);

  // 현재 활동 계산
  const currentActivity = routine?.routine[currentIndex] || null;

  // 진행률 계산
  useEffect(() => {
    if (!currentActivity || !routine) return;

    const originalTime = currentActivity.time;
    const progress = ((originalTime - timeLeft) / originalTime) * 100;
    setTotalProgress(progress);
  }, [timeLeft, currentActivity, routine]);

  // 타이머 관리 함수
  const manageTimer = useCallback(() => {
    // 기존 타이머 제거
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 새 타이머 생성
    timerRef.current = setInterval(() => {
      // ref를 사용하여 항상 최신 상태 접근
      const currentTimeLeft = timeLeftRef.current;
      const currentIdx = currentIndexRef.current;
      const currentRoutine = routineRef.current;

      if (currentTimeLeft <= 1) {
        // 현재 활동 종료
        const nextIndex = currentIdx + 1;

        // 루틴이 없거나 다음 인덱스가 범위를 벗어난 경우
        if (!currentRoutine || nextIndex >= currentRoutine.routine.length) {
          // 모든 활동 완료
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setIsRunning(false);
          setIsCompleted(true);
          setTimeLeft(0);
          return;
        }

        // 다음 활동으로 이동
        setCurrentIndex(nextIndex);
        setTimeLeft(currentRoutine.routine[nextIndex].time);
      } else {
        // 시간 감소
        setTimeLeft(currentTimeLeft - 1);
      }
    }, 1000);
  }, []);

  // 타이머 시작
  const startTimer = useCallback(() => {
    if (!routine || routine.routine.length === 0) return;

    setIsRunning(true);
    setIsPaused(false);
    setIsCompleted(false);

    manageTimer();
  }, [routine, manageTimer]);

  // 타이머 일시 정지
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsPaused(true);
    setIsRunning(false);
  }, []);

  // 타이머 재개
  const resumeTimer = useCallback(() => {
    if (!routine) return;

    setIsRunning(true);
    setIsPaused(false);

    manageTimer();
  }, [routine, manageTimer]);

  // 활동 건너뛰기
  const skipActivity = useCallback(() => {
    if (!routine) return;

    const nextIndex = currentIndex + 1;

    if (nextIndex >= routine.routine.length) {
      // 모든 활동 완료
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRunning(false);
      setIsCompleted(true);
      setTimeLeft(0);
    } else {
      // 다음 활동으로 이동
      setCurrentIndex(nextIndex);
      setTimeLeft(routine.routine[nextIndex].time);

      // 타이머가 실행 중이면 타이머 재설정
      if (isRunning) {
        // 약간의 지연 후 타이머 재설정 (상태 업데이트 완료를 보장)
        setTimeout(() => {
          manageTimer();
        }, 50);
      }
    }
  }, [routine, currentIndex, isRunning, manageTimer]);

  // 루틴 다시 시작
  const restartRoutine = useCallback(() => {
    if (!routine) return;

    // 기존 타이머 제거
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setCurrentIndex(0);
    setTimeLeft(routine.routine[0].time);
    setIsCompleted(false);

    // 약간의 지연 후 타이머 시작 (상태 업데이트 완료를 보장)
    setTimeout(() => {
      setIsRunning(true);
      setIsPaused(false);
      manageTimer();
    }, 50);
  }, [routine, manageTimer]);

  // 타이머 종료
  const exitTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRunning(false);
    setIsPaused(false);
  }, []);

  // 시간 포맷팅
  const formatTime = (timeInSeconds?: number): string => {
    if (timeInSeconds === undefined) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

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
