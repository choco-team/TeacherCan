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

  // 루틴이 로드되면 타이머 자동 시작
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
      {children}
    </PlayRoutineContext.Provider>
  );
}
