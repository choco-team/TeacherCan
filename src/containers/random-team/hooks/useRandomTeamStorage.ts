'use client';

import useLocalStorage from '@/hooks/useLocalStorage';

type PreAssignment = {
  student: string;
  groupIndex: number;
};

export type RandomTeamSettings = {
  students: string[];
  teamCount: number;
  preAssignments: PreAssignment[];
};

export function useRandomTeamSettings() {
  return useLocalStorage<RandomTeamSettings>('random-team-settings' as any, {
    students: [],
    teamCount: 4,
    preAssignments: [],
  });
}

export function useRandomTeamAutoRun() {
  return useLocalStorage<boolean>('random-team-auto-run' as any, false);
}
