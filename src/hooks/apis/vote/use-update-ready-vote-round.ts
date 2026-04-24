import { updateReadyVoteRound } from '@/apis/vote/vote';
import { useMutation } from '@tanstack/react-query';

export const useUpdateReadyVoteRound = () => {
  return useMutation({
    mutationFn: updateReadyVoteRound,
  });
};
