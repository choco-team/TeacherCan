import { ReactNode, useMemo, useEffect } from 'react';
import { PlayRoutineContext } from './hooks/use-play-routine-context';
import { usePlayRoutine } from './hooks/use-play-routine';
import AudioPlayer from './components/audio';

type PlayRoutineProviderProps = {
  routineId: string;
  children: ReactNode;
};

export function PlayRoutineProvider({
  routineId,
  children,
}: PlayRoutineProviderProps) {
  const routineData = usePlayRoutine(routineId);

  useEffect(() => {
    if (
      routineData.routine &&
      !routineData.isRunning &&
      !routineData.isPaused
    ) {
      routineData.startTimer();
    }
  }, [routineData.routine]);

  const value = useMemo(() => routineData, [routineData]);

  return (
    <PlayRoutineContext.Provider value={value}>
      {routineData.isRunning && <AudioPlayer musicUrl="../../" isPlaying />}
      {children}
    </PlayRoutineContext.Provider>
  );
}
