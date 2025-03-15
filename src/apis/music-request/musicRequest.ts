import { fetcher } from '../fetcher';

type CreateMusicRequestRoomResponse = { roomId: string };

export const createMusicRequestRoom = (params: { roomTitle: string }) => {
  return fetcher<CreateMusicRequestRoomResponse>('/music-request/room', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};
