import { getMusicRequestRoom } from '@/apis/music-request/musicRequest';
import { useQueries, useQuery } from '@tanstack/react-query';

export const useGetMusicRequestRoom = (params: { roomId: string }) => {
  return useQuery({
    queryKey: ['music-request-room', params.roomId],
    queryFn: () => getMusicRequestRoom(params),
  });
};

export const useGetMusicRequestRooms = (roomIds: string[]) => {
  return useQueries({
    queries: roomIds.map((roomId) => ({
      queryKey: ['music-request-room', roomId],
      queryFn: () => getMusicRequestRoom({ roomId }),
    })),
  });
};
