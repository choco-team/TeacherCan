import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 타이머 ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // 최신 상태값을 ref에 저장하여 클로저 문제 해결
  const timeLeftRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);

  // ref 값 동기화
  useEffect(() => {
    timeLeftRef.current = timeLeft;
    isRunningRef.current = isRunning;
  }, [timeLeft, isRunning]);

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

      if (currentTimeLeft <= 1) {
        // 타이머 종료
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setIsRunning(false);
        setTimeLeft(0);
      } else {
        // 시간 감소
        setTimeLeft(currentTimeLeft - 1);
      }
    }, 1000);
  }, []);

  // 타이머 시작
  const startTimer = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    manageTimer();
  }, [manageTimer]);

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
    setIsRunning(true);
    setIsPaused(false);
    manageTimer();
  }, [manageTimer]);

  // 타이머 중지
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRunning(false);
    setIsPaused(false);
  }, []);

  // 타이머 값 설정
  const setTimeValue = useCallback((value: number) => {
    setTimeLeft(value);
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    timeLeft,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    setTimeValue,
  };
};
