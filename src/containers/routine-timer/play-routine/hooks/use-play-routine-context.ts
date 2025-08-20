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
  skipActivity: () => void;
  jumpToActivity: (targetIndex: number) => void;
  previousActivity: () => void;
  restartRoutine: () => void;
  exitTimer: () => void;
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
