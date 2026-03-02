'use client';

import RoutineView from '@/containers/routine-timer/create-routine/routine-view';

type Props = {
  params: { id: string };
};

export default function RoutineDetailPage({ params }: Props) {
  return <RoutineView params={params} />;
}
