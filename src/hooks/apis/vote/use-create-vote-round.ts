import { createVoteRound } from '@/apis/vote/vote';
import { useMutation } from '@tanstack/react-query';

export const useCreateVoteRound = () => {
  return useMutation({
    mutationFn: createVoteRound,
  });
};
