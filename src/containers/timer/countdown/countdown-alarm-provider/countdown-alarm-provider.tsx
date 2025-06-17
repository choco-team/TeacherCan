import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useCountdownState } from '../countdown-provider/countdown-provider.hooks';
import { ALARM_SOUNDS } from './countdown-alarm-provider.constants';

type AlarmSoundValue = (typeof ALARM_SOUNDS)[number]['value'];

type CountdownAlarmState = {
  alarmTimes: number[];
  selectedAlarmSound: (typeof ALARM_SOUNDS)[number];
};

export const CountdownAlarmStateContext =
  createContext<CountdownAlarmState | null>(null);

type CountdownAlarmAction = {
  toggleAlarmTime: (num: number) => () => void;
  selectAlarmSound: (soundId: AlarmSoundValue) => void;
  previewAlarmSound: (soundId: AlarmSoundValue) => void;
};

export const CountdownAlarmActionContext =
  createContext<CountdownAlarmAction | null>(null);

const DEFAULT_ALARM_SOUND = ALARM_SOUNDS[0];

export default function CountdownAlarmProvider({
  children,
}: PropsWithChildren) {
  const [alarmAudio, setAlarmAudio] = useState<HTMLAudioElement>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(
    null,
  );
  const [alarmTimes, setAlarmTimes] = useState<number[]>([0]);
  const [selectedAlarmSoundValue, setSelectedAlarmSoundValue] =
    useLocalStorage<AlarmSoundValue>(
      'timer-alarm-sound',
      DEFAULT_ALARM_SOUND.value,
    );
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

  const selectAlarmSound = useCallback(
    (soundId: AlarmSoundValue) => {
      setSelectedAlarmSoundValue(soundId);
    },
    [setSelectedAlarmSoundValue],
  );

  const previewAlarmSound = useCallback(
    (soundValue: AlarmSoundValue) => {
      const sound = ALARM_SOUNDS.find(({ value }) => value === soundValue);
      if (!sound) return;

      if (previewAudio) {
        previewAudio.pause();
        previewAudio.src = '';
      }

      const audio = new Audio(sound.path);
      audio.play();
      setPreviewAudio(audio);

      audio.onended = () => {
        setPreviewAudio(null);
      };
    },
    [previewAudio],
  );

  useEffect(() => {
    const sound = ALARM_SOUNDS.find(
      ({ value }) => value === selectedAlarmSoundValue,
    );
    if (!sound) return;

    const audio = new Audio(sound.path);
    setAlarmAudio(audio);

    // eslint-disable-next-line consistent-return
    return () => {
      if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.src = '';
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAlarmSoundValue]);

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

  useEffect(() => {
    return () => {
      if (previewAudio) {
        previewAudio.pause();
        previewAudio.src = '';
      }
    };
  }, [previewAudio]);

  const defaultCountdownAlarmStateValue = useMemo(
    () => ({
      alarmTimes,
      selectedAlarmSound:
        ALARM_SOUNDS.find(({ value }) => value === selectedAlarmSoundValue) ??
        DEFAULT_ALARM_SOUND,
    }),
    [alarmTimes, selectedAlarmSoundValue],
  );

  const defaultCountdownAlarmActionValue = useMemo(
    () => ({
      toggleAlarmTime,
      selectAlarmSound,
      previewAlarmSound,
    }),
    [toggleAlarmTime, selectAlarmSound, previewAlarmSound],
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
