import { DeleteMusicRequestMusic } from '@/apis/music-request/musicRequest';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteMusicRequestMusic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DeleteMusicRequestMusic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['music-request-room'] });
    },
  });
};
