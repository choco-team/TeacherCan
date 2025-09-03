import { createContext, useContext } from 'react';
import type { Activity, Routine } from '../../create-routine/routine-types';

type PlayRoutineContextType = {
  routine: Routine | null;
  currentActivity: Activity | null;
  currentIndex: number;
  timeLeft: number;
  totalProgress: number;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  skipActivity: () => void;
  jumpToActivity: (targetIndex: number) => void;
  previousActivity: () => void;
  restartRoutine: () => void;
  exitTimer: () => void;
  setTimeValue: (value: number) => void;
  updateHours: (value: number, isIncrement: boolean) => void;
  updateMinutes: (value: number, isIncrement: boolean) => void;
  updateSeconds: (value: number, isIncrement: boolean) => void;
};

export const PlayRoutineContext = createContext<
  PlayRoutineContextType | undefined
>(undefined);

export function usePlayRoutineContext() {
  const context = useContext(PlayRoutineContext);
  if (context === undefined) {
    throw new Error(
      'usePlayRoutineContext must be used within a PlayRoutineProvider',
    );
  }
  return context;
}
