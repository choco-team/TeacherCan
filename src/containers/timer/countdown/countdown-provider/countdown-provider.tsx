import {
  createContext,
  type MutableRefObject,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { LottieRef, LottieRefCurrentProps } from 'lottie-react';
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
  youtubePlayerRef: MutableRefObject<YT.Player>;
  musicAnimationRef: LottieRef;
};

export const CountdownStateContext = createContext<CountdownState | null>(null);

type CountdownAction = {
  handleStart: () => void;
  handlePause: () => void;
  handleStop: () => void;
  handleReset: () => void;
  updateHours: (_hou: number, keepPreviousState?: boolean) => void;
  updateMinutes: (
    _min: number,
    keepPreviousState?: boolean,
    allowMaxMinuteTime?: boolean,
  ) => void;
  updateSeconds: (_sec: number, keepPreviousState?: boolean) => void;
  setIsMusicUsed: (value: SetStateAction<boolean>) => void;
  toggleMusicPlay: (to: 'on' | 'off') => void;
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

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const setupTimeRef = useRef<number>(0);
  const youtubePlayerRef = useRef<YT.Player>(null);
  const musicAnimationRef = useRef<LottieRefCurrentProps | null>(null);

  const hours = Math.floor(leftTime / HOUR_TO_SECONDS);
  const minutes = Math.floor(
    (leftTime - hours * HOUR_TO_SECONDS) / MINUTE_TO_SECONDS,
  );
  const seconds = Math.floor(leftTime % MINUTE_TO_SECONDS);

  const toggleMusicPlay = useCallback((to: 'on' | 'off') => {
    const isToPlay = to === 'on';

    if (!youtubePlayerRef.current) {
      return;
    }
    if (isToPlay) {
      youtubePlayerRef.current.playVideo();
      musicAnimationRef.current.play();
    } else {
      youtubePlayerRef.current.pauseVideo();
      musicAnimationRef.current.pause();
    }
  }, []);

  const handleStart = useCallback(() => {
    if (leftTime < 1) {
      return;
    }

    if (!setupTimeRef.current) {
      setupTimeRef.current = leftTime;
    }

    setIsActive(true);
    if (isMusicUsed) toggleMusicPlay('on');

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
  }, [leftTime, isMusicUsed, toggleMusicPlay]);

  const handlePause = useCallback(() => {
    setIsActive(false);
    if (isMusicUsed) toggleMusicPlay('off');
    if (timerRef.current) clearInterval(timerRef.current);
  }, [isMusicUsed, toggleMusicPlay]);

  const handleStop = useCallback(() => {
    setIsActive(false);
    if (isMusicUsed) toggleMusicPlay('off');
    if (setupTimeRef.current) {
      setLeftTime(setupTimeRef.current);
      setupTimeRef.current = NO_TIME;
    }

    if (timerRef.current) clearInterval(timerRef.current);
  }, [isMusicUsed, toggleMusicPlay]);

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
      if (isMusicUsed) toggleMusicPlay('off');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [leftTime, isActive, isMusicUsed, toggleMusicPlay]);

  const updateHours = useCallback(
    (hou: number, keepPreviousState: boolean = false) => {
      setLeftTime((prev) => {
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
      setLeftTime((prev) => {
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
      setLeftTime((prev) => {
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

  const defaultCountdownStateValue = useMemo<CountdownState>(
    () => ({
      hours,
      minutes,
      seconds,
      setupTime: setupTimeRef.current,
      leftTime,
      isActive,
      isMusicUsed,
      youtubePlayerRef,
      musicAnimationRef,
    }),
    [
      hours,
      minutes,
      seconds,
      setupTimeRef,
      leftTime,
      isActive,
      isMusicUsed,
      youtubePlayerRef,
      musicAnimationRef,
    ],
  );

  const defaultCountdownActionValue = useMemo<CountdownAction>(
    () => ({
      updateHours,
      updateMinutes,
      updateSeconds,
      handleStart,
      handlePause,
      handleStop,
      handleReset,
      setIsMusicUsed,
      toggleMusicPlay,
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
      toggleMusicPlay,
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
