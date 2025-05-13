'use client';

import RoutineForm from '@/containers/routine-timer/create-routine/routine-form';

type Props = {
  params: { id: string };
};

export default function RoutineDetailPage({ params }: Props) {
  return <RoutineForm params={params} />;
}
