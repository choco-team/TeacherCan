import { getMusicRequestRoomTitle } from '@/apis/music-request/musicRequest';
import { useQuery } from '@tanstack/react-query';

export const useGetMusicRequestRoomTitle = (params: { roomId: string }) => {
  return useQuery({
    queryKey: ['music-request-room-title'],
    queryFn: () => getMusicRequestRoomTitle(params),
  });
};
