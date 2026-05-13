import { startVoteRound } from '@/apis/vote/vote';
import { useMutation } from '@tanstack/react-query';

export const useStartVoteRound = () => {
  return useMutation({
    mutationFn: startVoteRound,
  });
};
