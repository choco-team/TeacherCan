import { deleteMusicRequestMusic } from '@/apis/music-request/musicRequest';
import { useMutation } from '@tanstack/react-query';

export const useDeleteMusicRequestMusic = () => {
  return useMutation({
    mutationFn: deleteMusicRequestMusic,
  });
};
