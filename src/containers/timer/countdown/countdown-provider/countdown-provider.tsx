import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type CountdownState = {
  // hours: number;
  minutes: number;
  seconds: number;
  leftTime: number;
  isActive: boolean;
  isPaused: boolean;
};

export const CountdownStateContext = createContext<CountdownState | null>(null);

type CountdownAction = {
  handlePause: () => void;
  handleReset: () => void;
  updateMinutes: (_min: number, keepPreviousState?: boolean) => void;
  updateSeconds: (_sec: number, keepPreviousState?: boolean) => void;
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const originalTime = useRef<number>(0);

  const minutes = Math.floor(leftTime / 60);
  const seconds = Math.floor(leftTime % 60);

  const startCountdown = useCallback(() => {
    if (leftTime < 1) {
      return;
    }

    if (!originalTime.current) {
      originalTime.current = leftTime;
    }

    setIsActive(true);
    setIsPaused(false);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setLeftTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timerRef.current!);
          return 0;
        }
        const newTime = prevTime - 1;
        return newTime;
      });
    }, 1000);
  }, [leftTime]);

  const handlePause = useCallback(() => {
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
  }, [isActive, isPaused, startCountdown]);

  const handleReset = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setLeftTime(originalTime.current);

    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (leftTime === 0 && isActive) {
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [leftTime, isActive]);

  const updateMinutes = useCallback(
    (min: number, keepPreviousState: boolean = false) => {
      const newLefTime =
        (keepPreviousState ? (minutes + min) * 60 : min * 60) + seconds;

      if (newLefTime < 0) {
        return;
      }

      setLeftTime(newLefTime);
    },

    [minutes, seconds],
  );

  const updateSeconds = useCallback(
    (sec: number, keepPreviousState: boolean = false) => {
      const newLefTime =
        minutes * 60 + (keepPreviousState ? seconds + sec : sec);

      if (newLefTime < 0) {
        return;
      }

      setLeftTime(newLefTime);
    },
    [minutes, seconds],
  );

  const defaultCountdownStateValue = useMemo(
    () => ({
      // hours,
      minutes,
      seconds,
      leftTime,
      isActive,
      isPaused,
    }),
    [minutes, seconds, leftTime, isActive, isPaused],
  );

  const defaultCountdownActionValue = useMemo(
    () => ({
      updateMinutes,
      updateSeconds,
      handlePause,
      handleReset,
    }),
    [updateMinutes, updateSeconds, handlePause, handleReset],
  );

  return (
    <CountdownStateContext.Provider value={defaultCountdownStateValue}>
      <CountdownActionContext.Provider value={defaultCountdownActionValue}>
        {children}
      </CountdownActionContext.Provider>
    </CountdownStateContext.Provider>
  );
}
