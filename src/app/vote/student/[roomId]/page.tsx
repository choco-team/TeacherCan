import VoteStudentContainer from '@/containers/vote/vote-student/vote-student-container';

export const metadata = {
  title: '투표하기',
};

export default function VoteStudentPage({
  params,
}: {
  params: { roomId: string };
}) {
  return <VoteStudentContainer params={params} />;
}
