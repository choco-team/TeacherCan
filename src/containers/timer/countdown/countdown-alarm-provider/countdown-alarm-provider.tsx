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
  toggleAlarmTime: (num: number) => () => void;
};

export const CountdownAlarmActionContext =
  createContext<CountdownAlarmAction | null>(null);

type Props = {
  children: ReactNode;
};

export default function CountdownAlarmProvider({ children }: Props) {
  const [alarmAudio, setAlarmAudio] = useState<HTMLAudioElement>(null);
  const [alarmTimes, setAlarmTimes] = useState<number[]>([0]);
  const { leftTime, isActive } = useCountdownState();

  const toggleAlarmTime = useCallback(
    (num: number) => () => {
      if (alarmTimes.includes(num)) {
        setAlarmTimes((prev) => prev.filter((time) => time !== num));
        return;
      }

      setAlarmTimes((prev) => [...prev, num]);
    },
    [alarmTimes],
  );

  useEffect(() => {
    // const alarmBasic = new Audio('/timer/audio/alarm-beeps.mp3');
    const alarmBasic = new Audio('/audio/timer/alarm-beeps.mp3');
    setAlarmAudio(alarmBasic);

    return () => {
      if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.src = '';
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!alarmAudio || !isActive) {
      return;
    }

    if (!alarmTimes.includes(leftTime)) {
      return;
    }

    alarmAudio.play();

    if (leftTime === 0) setAlarmTimes([0]);
  }, [alarmTimes, leftTime, isActive, alarmAudio]);

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
