'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { PanelLeft } from 'lucide-react';
import { MENU_ROUTE } from '@/constants/route';
import DualPanel from '@/components/dual-panel';
import { PlayRoutineProvider } from './play-routine-provider';
import ActivityDisplay from './components/activity-display';
import Activities from './components/activities';
import RoutineComplete from './components/routine-complete';
import RoutineBackgroundMusic from '../background-music/music';
import { usePlayRoutineContext } from './hooks/use-play-routine-context';

type PlayRoutineProps = {
  routineId: string;
};

function PlayRoutineContent({ routineId }: { routineId: string }) {
  const router = useRouter();

  const {
    routine,
    isLoading,
    isCompleted,
    exitTimer,
    restartRoutine,
    isRunning,
  } = usePlayRoutineContext();

  const handleExit = () => {
    exitTimer();

    // 팝업 창인 경우 창을 닫고, 아니면 이전 페이지로 이동
    if (window.opener) {
      window.close();
    } else {
      router.push(`${MENU_ROUTE.ROUTINE_TIMER}/${routineId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-lg text-gray-600">루틴을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh">
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
    <DualPanel.Root defaultOpen side="left">
      <DualPanel.Side>
        <DualPanel.Trigger asChild>
          <Button
            variant="gray-ghost"
            className="fixed top-6 left-6 z-[1] size-10 p-1"
          >
            <PanelLeft size={24} />
            <span className="sr-only">사이드바 토글</span>
          </Button>
        </DualPanel.Trigger>

        <DualPanel.Content className="!max-w-[280px] px-5" hideCloseButton>
          <div className="h-full flex flex-col gap-4">
            <DualPanel.Close asChild>
              <Button
                variant="gray-ghost"
                className="absolute top-2 right-2 size-6 p-1"
              >
                <PanelLeft size={16} className="text-gray-600" />
                <span className="sr-only">사이드바 닫기</span>
              </Button>
            </DualPanel.Close>

            {/* 헤더: 제목 + 닫기 버튼 */}
            <h2 className="mt-1 text-xl font-bold text-gray-900 break-words">
              {routine.title}
            </h2>

            <Activities />
          </div>
        </DualPanel.Content>
      </DualPanel.Side>

      <div className="relative flex flex-col min-h-dvh">
        <DualPanel.Main className="flex flex-col min-h-dvh data-[state=open]:!ml-[280px]">
          <div className="flex-1 flex items-center justify-center">
            {isCompleted ? (
              <RoutineComplete onRestart={restartRoutine} onExit={handleExit} />
            ) : (
              <ActivityDisplay />
            )}
          </div>

          <RoutineBackgroundMusic
            routineId={routineId}
            isPlaying={isRunning && !isCompleted}
          />
        </DualPanel.Main>
      </div>
    </DualPanel.Root>
  );
}

export default function PlayRoutine({ routineId }: PlayRoutineProps) {
  return (
    <PlayRoutineProvider routineId={routineId}>
      <PlayRoutineContent routineId={routineId} />
    </PlayRoutineProvider>
  );
}
