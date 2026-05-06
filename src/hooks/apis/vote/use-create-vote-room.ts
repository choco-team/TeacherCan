import { createVoteRoom } from '@/apis/vote/vote';
import { useMutation } from '@tanstack/react-query';

export const useCreateVoteRoom = () => {
  return useMutation({
    mutationFn: createVoteRoom,
  });
};
