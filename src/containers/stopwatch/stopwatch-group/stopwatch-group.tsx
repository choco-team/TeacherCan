'use client';

import GroupStopwatchProvider from './stopwatch-group-provider';
import GroupSetupList from './group-setup-list';
import GroupTimerDisplay from './group-timer-display';

interface StopwatchGroupProps {
  params?: {
    id?: string;
  };
}

function StopwatchGroupContent({ params }: StopwatchGroupProps) {
  const groupId = params?.id;

  if (groupId) {
    return <GroupTimerDisplay groupId={groupId} />;
  }

  return (
    <div>
      <GroupSetupList />
    </div>
  );
}

export default function StopwatchGroup({ params }: StopwatchGroupProps) {
  return (
    <GroupStopwatchProvider>
      <StopwatchGroupContent params={params} />
    </GroupStopwatchProvider>
  );
}
