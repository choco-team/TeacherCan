'use client';

import PlayRoutine from '@/containers/routine-timer/play-routine/play-routine';

type Props = {
  params: { id: string };
};

export default function RoutinePlayPage({ params }: Props) {
  return <PlayRoutine routineId={params.id} />;
}
