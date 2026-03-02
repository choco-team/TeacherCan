import { ReactNode, useMemo } from 'react';
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

  const value = useMemo(() => routineData, [routineData]);

  return (
    <PlayRoutineContext.Provider value={value}>
      {children}
    </PlayRoutineContext.Provider>
  );
}
