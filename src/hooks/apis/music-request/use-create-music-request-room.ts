import { createMusicRequestRoom } from '@/apis/music-request/musicRequest';
import { useMutation } from '@tanstack/react-query';

export const useCreateMusicRequestRoom = () => {
  return useMutation({
    mutationFn: createMusicRequestRoom,
  });
};
