import { useState, useEffect, useCallback, useRef } from 'react';
import {
  HOUR_TO_SECONDS,
  MAX_TIME,
  MAX_TIME_INPUT,
  MINUTE_TO_SECONDS,
  NO_TIME,
} from '../../routine-timer.constants';

export const useTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 타이머 종료 콜백
  const onTimerCompleteRef = useRef<(() => void) | null>(null);

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
        setTimeLeft(0);

        // isRunning은 false로 설정하지 않고, 콜백 호출
        if (typeof onTimerCompleteRef.current === 'function') {
          onTimerCompleteRef.current();
        }
      } else {
        // 시간 감소
        setTimeLeft(currentTimeLeft - 1);
      }
    }, 1000);
  }, []);

  // 타이머 시작
  const startTimer = useCallback(
    (onComplete?: () => void) => {
      // 타이머 완료 콜백 설정
      if (onComplete) {
        onTimerCompleteRef.current = onComplete;
      }

      setIsRunning(true);
      setIsPaused(false);
      manageTimer();
    },
    [manageTimer],
  );
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

  const updateHours = useCallback(
    (hou: number, keepPreviousState: boolean = false) => {
      setTimeLeft((prev) => {
        let newHour = hou;
        if (hou > MAX_TIME_INPUT.HOUR) newHour = MAX_TIME_INPUT.HOUR;

        const newHours = Math.floor(prev / HOUR_TO_SECONDS);
        const newMinutes = Math.floor(
          (prev - newHours * HOUR_TO_SECONDS) / MINUTE_TO_SECONDS,
        );
        const newSeconds = Math.floor(prev % MINUTE_TO_SECONDS);

        const newLeftTime =
          (keepPreviousState
            ? (newHour + newHours) * HOUR_TO_SECONDS
            : newHour * HOUR_TO_SECONDS) +
          newMinutes * MINUTE_TO_SECONDS +
          newSeconds;

        if (newLeftTime < NO_TIME || newLeftTime > MAX_TIME) {
          return prev;
        }

        return newLeftTime;
      });
    },
    [],
  );

  const updateMinutes = useCallback(
    (
      min: number,
      keepPreviousState: boolean = false,
      allowMaxMinuteTime: boolean = false,
    ) => {
      setTimeLeft((prev) => {
        let newMinute = min;
        if (min > MAX_TIME_INPUT.MINUTE && !allowMaxMinuteTime)
          newMinute = MAX_TIME_INPUT.MINUTE;

        const newHours = Math.floor(prev / HOUR_TO_SECONDS);
        const newMinutes = Math.floor(
          (prev - newHours * HOUR_TO_SECONDS) / MINUTE_TO_SECONDS,
        );
        const newSeconds = Math.floor(prev % MINUTE_TO_SECONDS);

        const newLeftTime =
          newHours * HOUR_TO_SECONDS +
          (keepPreviousState
            ? (newMinutes + newMinute) * MINUTE_TO_SECONDS
            : newMinute * MINUTE_TO_SECONDS) +
          newSeconds;

        if (newLeftTime < NO_TIME || newLeftTime > MAX_TIME) {
          return prev;
        }

        return newLeftTime;
      });
    },
    [],
  );

  const updateSeconds = useCallback(
    (sec: number, keepPreviousState: boolean = false) => {
      setTimeLeft((prev) => {
        let newSecond = sec;
        if (sec > MAX_TIME_INPUT.SECOND) newSecond = MAX_TIME_INPUT.SECOND;

        const newHours = Math.floor(prev / HOUR_TO_SECONDS);
        const newMinutes = Math.floor(
          (prev - newHours * HOUR_TO_SECONDS) / MINUTE_TO_SECONDS,
        );
        const newSeconds = Math.floor(prev % MINUTE_TO_SECONDS);

        const newLeftTime =
          newHours * HOUR_TO_SECONDS +
          newMinutes * MINUTE_TO_SECONDS +
          (keepPreviousState ? newSeconds + newSecond : newSecond);

        if (newLeftTime < NO_TIME || newLeftTime > MAX_TIME) {
          return prev;
        }

        return newLeftTime;
      });
    },
    [],
  );

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
    updateHours,
    updateMinutes,
    updateSeconds,
  };
};
