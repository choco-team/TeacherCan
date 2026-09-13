import { deleteMusicRequestRoom } from '@/apis/music-request/musicRequest';
import { useMutation } from '@tanstack/react-query';

export const useDeleteMusicRequestRoom = () => {
  return useMutation({
    mutationFn: deleteMusicRequestRoom,
  });
};
