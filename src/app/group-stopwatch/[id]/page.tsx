import StopwatchGroup from '@/containers/stopwatch/stopwatch-group/stopwatch-group';

export const metadata = {
  title: '그룹 스톱워치',
};

interface GroupStopwatchPageProps {
  params: {
    id: string;
  };
}

export default function GroupStopwatchPage({
  params,
}: GroupStopwatchPageProps) {
  return <StopwatchGroup params={params} />;
}
