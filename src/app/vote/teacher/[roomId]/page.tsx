import VoteTeacherContainer from '@/containers/vote/vote-teacher/vote-teacher-container';

export const metadata = {
  title: '투표하기',
};

export default function VoteTeacherPage({
  params,
}: {
  params: { roomId: string };
}) {
  return <VoteTeacherContainer params={params} />;
}
