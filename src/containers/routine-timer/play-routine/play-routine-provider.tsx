import { ReactNode, useMemo, useEffect } from 'react';
import { PlayRoutineContext } from './hooks/use-play-routine-context';
import { usePlayRoutine } from './hooks/use-play-routine';

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

  // const musicUrl = '/audio/routine-timer/routine-timer-bgm.mp3';

  return (
    <PlayRoutineContext.Provider value={value}>
      {/* <AudioPlayer
        musicUrl={musicUrl}
        isPlaying={routineData.isRunning && !routineData.isPaused}
      /> */}
      {children}
    </PlayRoutineContext.Provider>
  );
}
