import { endVoteRound } from '@/apis/vote/vote';
import { useMutation } from '@tanstack/react-query';

export const useEndVoteRound = () => {
  return useMutation({
    mutationFn: endVoteRound,
  });
};
