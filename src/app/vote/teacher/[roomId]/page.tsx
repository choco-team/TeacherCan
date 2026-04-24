import VoteTeacherContainer from '@/containers/vote/vote-teacher/vote-teacher-container';
import { normalizeVoteRoomId } from '@/containers/vote/vote-room-id';
import { redirect } from 'next/navigation';

export const metadata = {
  title: '투표하기',
};

export default function VoteTeacherPage({
  params,
}: {
  params: { roomId: string };
}) {
  const normalizedRoomId = normalizeVoteRoomId(params.roomId);

  if (normalizedRoomId !== params.roomId) {
    redirect(`/vote/teacher/${normalizedRoomId}`);
  }

  return <VoteTeacherContainer params={{ roomId: normalizedRoomId }} />;
}
