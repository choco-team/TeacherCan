import { finishVoteRoom } from '@/apis/vote/vote';
import { useMutation } from '@tanstack/react-query';

export const useFinishVoteRoom = () => {
  return useMutation({
    mutationFn: finishVoteRoom,
  });
};
