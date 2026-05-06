import { joinVoteRoomParticipant } from '@/apis/vote/vote';
import { useMutation } from '@tanstack/react-query';

export const useJoinVoteRoomParticipant = () => {
  return useMutation({
    mutationFn: joinVoteRoomParticipant,
  });
};
