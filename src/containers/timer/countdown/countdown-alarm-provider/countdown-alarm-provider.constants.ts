const ALARM_SOUNDS_PATH = '/audio/timer/alarm';

export const ALARM_SOUNDS = [
  {
    value: 'melody-1',
    label: '멜로디 1',
    path: `${ALARM_SOUNDS_PATH}/melody-1.mp3`,
  },
  {
    value: 'melody-2',
    label: '멜로디 2',
    path: `${ALARM_SOUNDS_PATH}/melody-2.mp3`,
  },
  {
    value: 'melody-3',
    label: '멜로디 3',
    path: `${ALARM_SOUNDS_PATH}/melody-3.mp3`,
  },
  {
    value: 'melody-4',
    label: '멜로디 4',
    path: `${ALARM_SOUNDS_PATH}/melody-4.mp3`,
  },
  {
    value: 'beep',
    label: '삐비비빅',
    path: `${ALARM_SOUNDS_PATH}/beep.mp3`,
  },
  {
    value: 'explosion',
    label: '폭발',
    path: `${ALARM_SOUNDS_PATH}/explosion.mp3`,
  },
] as const;
