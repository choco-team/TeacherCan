import { useState } from 'react';

type PreAssignment = {
  student: string;
  groupIndex: number;
};

export type RandomTeamSettings = {
  students: string[];
  teamCount: number;
  preAssignments: PreAssignment[];
};

const RANDOM_TEAM_SETTINGS_KEY = 'random-team-settings';
const RANDOM_TEAM_AUTO_RUN_KEY = 'random-team-auto-run';

/**
 * localStorage 안전 읽기
 */
function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

/**
 * 랜덤 모둠 설정 저장 훅
 */
export function useRandomTeamSettings() {
  const [settings, setSettings] = useState<RandomTeamSettings>(() =>
    readLocalStorage<RandomTeamSettings>(RANDOM_TEAM_SETTINGS_KEY, {
      students: [],
      teamCount: 4,
      preAssignments: [],
    }),
  );

  const setRandomTeamSettings = (value: RandomTeamSettings) => {
    setSettings(value);

    if (typeof window !== 'undefined') {
      localStorage.setItem(RANDOM_TEAM_SETTINGS_KEY, JSON.stringify(value));
    }
  };

  return [settings, setRandomTeamSettings] as const;
}

export function useRandomTeamAutoRun() {
  const [autoRun, setAutoRun] = useState<boolean>(() =>
    readLocalStorage<boolean>(RANDOM_TEAM_AUTO_RUN_KEY, false),
  );

  const setRandomTeamAutoRun = (value: boolean) => {
    setAutoRun(value);

    if (typeof window !== 'undefined') {
      localStorage.setItem(RANDOM_TEAM_AUTO_RUN_KEY, JSON.stringify(value));
    }
  };

  return [autoRun, setRandomTeamAutoRun] as const;
}
