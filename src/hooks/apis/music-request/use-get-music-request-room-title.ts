import { getMusicRequestRoomTitle } from '@/apis/music-request/musicRequest';
import { useQuery } from '@tanstack/react-query';

export const useGetMusicRequestRoomTitle = (params: { roomId: string }) => {
  return useQuery({
    queryKey: ['music-request-room-title', params.roomId],
    queryFn: () => getMusicRequestRoomTitle(params),
    // 없는 방은 재시도해도 결과가 달라지지 않는다
    retry: false,
  });
};
