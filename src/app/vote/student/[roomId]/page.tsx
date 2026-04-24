import VoteStudentContainer from '@/containers/vote/vote-student/vote-student-container';
import { normalizeVoteRoomId } from '@/containers/vote/vote-room-id';
import { redirect } from 'next/navigation';

export const metadata = {
  title: '투표하기',
};

export default function VoteStudentPage({
  params,
}: {
  params: { roomId: string };
}) {
  const normalizedRoomId = normalizeVoteRoomId(params.roomId);

  if (normalizedRoomId !== params.roomId) {
    redirect(`/vote/student/${normalizedRoomId}`);
  }

  return <VoteStudentContainer params={{ roomId: normalizedRoomId }} />;
}
