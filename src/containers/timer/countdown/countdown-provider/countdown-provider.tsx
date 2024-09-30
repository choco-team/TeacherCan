import {
  createContext,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  MAX_TIME,
  NO_TIME,
  HOUR_TO_SECONDS,
  MINUTE_TO_SECONDS,
} from './countdown-provider.constants';

type CountdownState = {
  hours: number;
  minutes: number;
  seconds: number;
  leftTime: number;
  isActive: boolean;
  isPaused: boolean;
  isMusicUsed: boolean;
  isMusicPlay: boolean;
};

export const CountdownStateContext = createContext<CountdownState | null>(null);

type CountdownAction = {
  handlePause: () => void;
  handleReset: () => void;
  updateHours: (_hou: number, keepPreviousState?: boolean) => void;
  updateMinutes: (_min: number, keepPreviousState?: boolean) => void;
  updateSeconds: (_sec: number, keepPreviousState?: boolean) => void;
  setIsMusicUsed: (value: SetStateAction<boolean>) => void;
  setIsMusicPlay: (value: SetStateAction<boolean>) => void;
};

export const CountdownActionContext = createContext<CountdownAction | null>(
  null,
);

type Props = {
  children: ReactNode;
};

export default function CountdownProvider({ children }: Props) {
  const [leftTime, setLeftTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMusicUsed, setIsMusicUsed] = useState(false);
  const [isMusicPlay, setIsMusicPlay] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const originalTime = useRef<number>(0);

  const hours = Math.floor(leftTime / HOUR_TO_SECONDS);
  const minutes = Math.floor(
    (leftTime - hours * HOUR_TO_SECONDS) / MINUTE_TO_SECONDS,
  );
  const seconds = Math.floor(leftTime % MINUTE_TO_SECONDS);

  const startCountdown = useCallback(() => {
    if (leftTime < 1) {
      return;
    }

    if (!originalTime.current) {
      originalTime.current = leftTime;
    }

    if (isMusicUsed) setIsMusicPlay(true);
    setIsActive(true);
    setIsPaused(false);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setLeftTime((prevTime) => {
        if (prevTime <= NO_TIME) {
          clearInterval(timerRef.current!);
          return 0;
        }
        const newTime = prevTime - 1;
        return newTime;
      });
    }, 1000);
  }, [leftTime, isMusicUsed]);

  const handlePause = useCallback(() => {
    if (isActive) {
      if (isPaused) {
        setIsPaused(false);
        startCountdown();
      } else {
        setIsPaused(true);
        if (isMusicUsed) setIsMusicPlay(false);
        setIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    } else {
      startCountdown();
    }
  }, [isActive, isPaused, startCountdown, isMusicUsed]);

  const handleReset = useCallback(() => {
    if (isMusicUsed) setIsMusicPlay(false);
    setIsActive(false);
    setIsPaused(false);
    setLeftTime(originalTime.current);

    if (timerRef.current) clearInterval(timerRef.current);
  }, [isMusicUsed]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (leftTime === NO_TIME && isActive) {
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [leftTime, isActive]);

  const updateHours = useCallback(
    (hou: number, keepPreviousState: boolean = false) => {
      const newLeftTime =
        (keepPreviousState
          ? (hours + hou) * HOUR_TO_SECONDS
          : hou * HOUR_TO_SECONDS) +
        minutes * MINUTE_TO_SECONDS +
        seconds;

      if (newLeftTime < NO_TIME || newLeftTime > MAX_TIME) {
        return;
      }
      setLeftTime(newLeftTime);
    },
    [hours, minutes, seconds],
  );

  const updateMinutes = useCallback(
    (min: number, keepPreviousState: boolean = false) => {
      const newLefTime =
        hours * HOUR_TO_SECONDS +
        (keepPreviousState
          ? (minutes + min) * MINUTE_TO_SECONDS
          : min * MINUTE_TO_SECONDS) +
        seconds;

      if (newLefTime < NO_TIME || newLefTime > MAX_TIME) {
        return;
      }

      setLeftTime(newLefTime);
    },

    [hours, minutes, seconds],
  );

  const updateSeconds = useCallback(
    (sec: number, keepPreviousState: boolean = false) => {
      const newLefTime =
        hours * HOUR_TO_SECONDS +
        minutes * MINUTE_TO_SECONDS +
        (keepPreviousState ? seconds + sec : sec);

      if (newLefTime < NO_TIME || newLefTime > MAX_TIME) {
        return;
      }

      setLeftTime(newLefTime);
    },
    [hours, minutes, seconds],
  );

  const defaultCountdownStateValue = useMemo(
    () => ({
      hours,
      minutes,
      seconds,
      leftTime,
      isActive,
      isPaused,
      isMusicUsed,
      isMusicPlay,
    }),
    [hours, minutes, seconds, leftTime, isActive, isPaused, isMusicUsed, isMusicPlay],
  );

  const defaultCountdownActionValue = useMemo(
    () => ({
      updateHours,
      updateMinutes,
      updateSeconds,
      handlePause,
      handleReset,
      setIsMusicUsed,
      setIsMusicPlay,
    }),
    [
      updateHours, 
      updateMinutes, 
      updateSeconds, 
      handlePause, 
      handleReset, 
      setIsMusicUsed,
      setIsMusicPlay,
    ],
  );

  return (
    <CountdownStateContext.Provider value={defaultCountdownStateValue}>
      <CountdownActionContext.Provider value={defaultCountdownActionValue}>
        {children}
      </CountdownActionContext.Provider>
    </CountdownStateContext.Provider>
  );
}
