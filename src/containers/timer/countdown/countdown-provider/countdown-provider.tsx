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
  MAX_TIME_INPUT,
} from './countdown-provider.constants';

type CountdownState = {
  hours: number;
  minutes: number;
  seconds: number;
  setupTime: number;
  leftTime: number;
  isActive: boolean;
  isMusicUsed: boolean;
  isMusicPlay: boolean;
};

export const CountdownStateContext = createContext<CountdownState | null>(null);

type CountdownAction = {
  handleStart: () => void;
  handlePause: () => void;
  handleStop: () => void;
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
  const [isMusicUsed, setIsMusicUsed] = useState(false);
  const [isMusicPlay, setIsMusicPlay] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const setupTimeRef = useRef<number>(0);

  const hours = Math.floor(leftTime / HOUR_TO_SECONDS);
  const minutes = Math.floor(
    (leftTime - hours * HOUR_TO_SECONDS) / MINUTE_TO_SECONDS,
  );
  const seconds = Math.floor(leftTime % MINUTE_TO_SECONDS);

  const handleStart = useCallback(() => {
    if (leftTime < 1) {
      return;
    }

    if (!setupTimeRef.current) {
      setupTimeRef.current = leftTime;
    }

    if (isMusicUsed) setIsMusicPlay(true);
    setIsActive(true);

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
    if (!isActive) return;

    if (isMusicUsed) setIsMusicPlay(false);
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [isActive, isMusicUsed]);

  const handleStop = useCallback(() => {
    if (isMusicUsed) setIsMusicPlay(false);
    setIsActive(false);
    if (setupTimeRef.current) {
      setLeftTime(setupTimeRef.current);
      setupTimeRef.current = NO_TIME;
    }

    if (timerRef.current) clearInterval(timerRef.current);
  }, [isMusicUsed]);

  const handleReset = useCallback(() => {
    if (setupTimeRef.current) {
      setupTimeRef.current = NO_TIME;
    }

    setLeftTime(NO_TIME);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (leftTime === NO_TIME && isActive) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [leftTime, isActive]);

  const updateHours = useCallback(
    (hou: number, keepPreviousState: boolean = false) => {
      let newHour = hou;
      if (hou > MAX_TIME_INPUT.HOUR) newHour = MAX_TIME_INPUT.HOUR;

      const newLeftTime =
        (keepPreviousState
          ? (hours + newHour) * HOUR_TO_SECONDS
          : newHour * HOUR_TO_SECONDS) +
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
      let newMinute = min;
      if (min > MAX_TIME_INPUT.MINUTE) newMinute = MAX_TIME_INPUT.MINUTE;

      const newLeftTime =
        hours * HOUR_TO_SECONDS +
        (keepPreviousState
          ? (minutes + newMinute) * MINUTE_TO_SECONDS
          : newMinute * MINUTE_TO_SECONDS) +
        seconds;

      if (newLeftTime < NO_TIME || newLeftTime > MAX_TIME) {
        return;
      }

      setLeftTime(newLeftTime);
    },

    [hours, minutes, seconds],
  );

  const updateSeconds = useCallback(
    (sec: number, keepPreviousState: boolean = false) => {
      let newSecond = sec;
      if (sec > MAX_TIME_INPUT.SECOND) newSecond = MAX_TIME_INPUT.SECOND;

      const newLeftTime =
        hours * HOUR_TO_SECONDS +
        minutes * MINUTE_TO_SECONDS +
        (keepPreviousState ? seconds + newSecond : newSecond);

      if (newLeftTime < NO_TIME || newLeftTime > MAX_TIME) {
        return;
      }

      setLeftTime(newLeftTime);
    },
    [hours, minutes, seconds],
  );

  const defaultCountdownStateValue = useMemo(
    () => ({
      hours,
      minutes,
      seconds,
      setupTime: setupTimeRef.current,
      leftTime,
      isActive,
      isMusicUsed,
      isMusicPlay,
    }),
    [
      hours,
      minutes,
      seconds,
      setupTimeRef,
      leftTime,
      isActive,
      isMusicUsed,
      isMusicPlay,
    ],
  );

  const defaultCountdownActionValue = useMemo(
    () => ({
      updateHours,
      updateMinutes,
      updateSeconds,
      handleStart,
      handlePause,
      handleStop,
      handleReset,
      setIsMusicUsed,
      setIsMusicPlay,
    }),
    [
      updateHours,
      updateMinutes,
      updateSeconds,
      handleStart,
      handlePause,
      handleStop,
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
