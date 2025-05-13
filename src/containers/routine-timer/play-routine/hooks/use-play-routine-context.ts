import { createContext, useContext } from 'react';
import { Routine } from '../../create-routine/routine-types';

type PlayRoutineContextType = {
  routine: Routine | null;
  currentActivity: any | null;
  currentIndex: number;
  timeLeft: number;
  totalProgress: number;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  formatTime: (timeInSeconds?: number) => string;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  skipActivity: () => void;
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
