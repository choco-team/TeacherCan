import { createMusicRequestStudent } from '@/apis/music-request/musicRequest';
import { useMutation } from '@tanstack/react-query';

export const useCreateMusicRequestStudent = () => {
  return useMutation({
    mutationFn: createMusicRequestStudent,
  });
};
