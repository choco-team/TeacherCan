import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useCountdownState } from '../countdown-provider/countdown-provider.hooks';

type CountdownAlarmState = {
  alarmTimes: number[];
};

export const CountdownAlarmStateContext =
  createContext<CountdownAlarmState | null>(null);

type CountdownAlarmAction = {
  toggleAlarmTime: (_num: number) => void;
};

export const CountdownAlarmActionContext =
  createContext<CountdownAlarmAction | null>(null);

type Props = {
  children: ReactNode;
};

export default function CountdownAlarmProvider({ children }: Props) {
  const [alarmAudio, setAlarmAudio] = useState<HTMLAudioElement>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  const [alarmTimes, setAlarmTimes] = useState<number[]>([0, 10]);
  const { leftTime, isActive } = useCountdownState();

  const toggleAlarmTime = useCallback(
    (num: number) => {
      if (alarmTimes.includes(num)) {
        setAlarmTimes((prev) => prev.filter((time) => time !== num));
        return;
      }

      setAlarmTimes((prev) => [...prev, num]);
    },
    [alarmTimes],
  );

  const handleUserInteraction = () => {
    setUserInteracted(true);
  };

  useEffect(() => {
    const alarmBasic = new Audio('/audio/alarm-basic.mp3');
    setAlarmAudio(alarmBasic);

    return () => {
      if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.src = '';
      }
    };
  }, [alarmAudio]);

  useEffect(() => {
    if (!alarmAudio || !userInteracted || !isActive) {
      return;
    }

    if (!alarmTimes.includes(leftTime)) {
      return;
    }

    alarmAudio.play();
  }, [alarmTimes, leftTime, isActive, userInteracted, alarmAudio]);

  useEffect(() => {
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  const defaultCountdownAlarmStateValue = useMemo(
    () => ({
      alarmTimes,
    }),
    [alarmTimes],
  );

  const defaultCountdownAlarmActionValue = useMemo(
    () => ({
      toggleAlarmTime,
    }),
    [toggleAlarmTime],
  );

  return (
    <CountdownAlarmStateContext.Provider
      value={defaultCountdownAlarmStateValue}
    >
      <CountdownAlarmActionContext.Provider
        value={defaultCountdownAlarmActionValue}
      >
        {children}
      </CountdownAlarmActionContext.Provider>
    </CountdownAlarmStateContext.Provider>
  );
}
