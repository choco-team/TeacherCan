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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routineData.routine]);

  const value = useMemo(() => routineData, [routineData]);

  return (
    <PlayRoutineContext.Provider value={value}>
      {children}
    </PlayRoutineContext.Provider>
  );
}
