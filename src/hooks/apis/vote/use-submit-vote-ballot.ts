import { submitVoteBallot } from '@/apis/vote/vote';
import { useMutation } from '@tanstack/react-query';

export const useSubmitVoteBallot = () => {
  return useMutation({
    mutationFn: submitVoteBallot,
  });
};
