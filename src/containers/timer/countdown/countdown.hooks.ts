import { useState, useRef, useEffect } from 'react';

export function useCountdown() {
  const [minutes, setMinutes] = useState<number | string>('');
  const [seconds, setSeconds] = useState<number | string>('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const originalTime = useRef<number>(0);

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    setMinutes(min);
    setSeconds(sec);
  };

  const startCountdown = (): void => {
    const min = Number(minutes);
    const sec = Number(seconds);
    if ((min >= 0 || sec >= 0) && (min || sec)) {
      const totalSeconds = min * 60 + sec;
      if (!originalTime.current) {
        originalTime.current = totalSeconds;
      }

      setTimeLeft(totalSeconds);
      setIsActive(true);
      setIsPaused(false);

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timerRef.current!);
            formatTime(0);
            return 0;
          }
          const newTime = prevTime - 1;
          formatTime(newTime);
          return newTime;
        });
      }, 1000);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      if (isPaused) {
        setIsPaused(false);
        startCountdown();
      } else {
        setIsPaused(true);
        setIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    } else {
      startCountdown();
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(originalTime.current);
    const min = Math.floor(originalTime.current / 60);
    const sec = originalTime.current % 60;
    setMinutes(min);
    setSeconds(sec);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [timeLeft, isActive]);

  const handleMinutesChange = (min: number) => {
    if (min < 0) {
      return;
    }

    setMinutes(min);
  };

  const handleSecondsChange = (sec: number) => {
    if (sec < 0) {
      return;
    }

    setSeconds(sec);
  };

  return {
    minutes,
    seconds,
    isActive,
    isPaused,
    handleMinutesChange,
    handleSecondsChange,
    handlePause,
    handleReset,
  };
}
