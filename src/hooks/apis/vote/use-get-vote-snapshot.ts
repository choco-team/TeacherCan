import {
  getVoteStudentSnapshot,
  getVoteTeacherSnapshot,
} from '@/apis/vote/vote';
import { useQueries, useQuery } from '@tanstack/react-query';

export const useGetVoteTeacherSnapshot = (params: { roomId: string }) => {
  return useQuery({
    queryKey: ['vote-teacher-snapshot', params.roomId],
    queryFn: () => getVoteTeacherSnapshot(params),
    enabled: Boolean(params.roomId),
  });
};

export const useGetVoteTeacherSnapshots = (roomIds: string[]) => {
  return useQueries({
    queries: roomIds.map((roomId) => ({
      queryKey: ['vote-teacher-snapshot', roomId],
      queryFn: () => getVoteTeacherSnapshot({ roomId }),
    })),
  });
};

export const useGetVoteStudentSnapshot = (params: {
  roomId: string;
  participantToken: string;
}) => {
  return useQuery({
    queryKey: ['vote-student-snapshot', params.roomId, params.participantToken],
    queryFn: () => getVoteStudentSnapshot(params),
    enabled: Boolean(params.roomId && params.participantToken),
  });
};
