import { createMusicRequestMusic } from '@/apis/music-request/musicRequest';
import { useMutation } from '@tanstack/react-query';

export const useCreateMusicRequestMusic = () => {
  return useMutation({
    mutationFn: createMusicRequestMusic,
  });
};
