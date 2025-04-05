import { getMusicRequestRoom } from '@/apis/music-request/musicRequest';
import { useQuery } from '@tanstack/react-query';

export const useGetMusicRequestRoom = (params: { roomId: string }) => {
  return useQuery({
    queryKey: ['music-request-room', params.roomId],
    queryFn: () => getMusicRequestRoom(params),
  });
};
