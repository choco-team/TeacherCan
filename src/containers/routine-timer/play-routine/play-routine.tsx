'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { X, Music } from 'lucide-react';
import { useState } from 'react';
import { PlayRoutineProvider } from './play-routine-provider';
import ActivityDisplay from './components/activity-display';
import NextActivities from './components/next-activities';
import RoutineComplete from './components/routine-complete';
import RoutineBackgroundMusic from '../background-music/music';
import { usePlayRoutineContext } from './hooks/use-play-routine-context';

type PlayRoutineProps = {
  routineId: string;
};

function PlayRoutineContent({ routineId }: { routineId: string }) {
  const router = useRouter();
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const { routine, isCompleted, exitTimer, restartRoutine, isRunning } =
    usePlayRoutineContext();

  const handleExit = () => {
    exitTimer();
    router.push(`/routine-timer/${routine?.key}`);
  };

  const toggleMusic = () => {
    setIsMusicEnabled(!isMusicEnabled);
  };

  if (!routine) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-2xl text-gray-500 mb-4">루틴을 찾을 수 없습니다</p>
        <Button
          onClick={() => router.push('/routine-timer')}
          className="bg-primary-500 text-white px-4 py-2 rounded"
        >
          돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{routine.title}</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={toggleMusic}
            className={`p-2 ${isMusicEnabled ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Music size={20} />
          </Button>
          <Button
            onClick={handleExit}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </Button>
        </div>
      </div>

      {isCompleted ? (
        <RoutineComplete onRestart={restartRoutine} onExit={handleExit} />
      ) : (
        <>
          <ActivityDisplay />
          <NextActivities />
        </>
      )}

      {isMusicEnabled && (
        <RoutineBackgroundMusic
          routineId={routineId}
          isPlaying={isRunning && !isCompleted}
        />
      )}
    </div>
  );
}

export default function PlayRoutine({ routineId }: PlayRoutineProps) {
  return (
    <PlayRoutineProvider routineId={routineId}>
      <PlayRoutineContent routineId={routineId} />
    </PlayRoutineProvider>
  );
}
