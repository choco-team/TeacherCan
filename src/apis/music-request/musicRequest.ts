import { fetcher } from '../fetcher';

type CreateMusicRequestRoomResponse = { roomId: string };

export const createMusicRequestRoom = (params: { roomTitle: string }) => {
  return fetcher<CreateMusicRequestRoomResponse>('/music-request/room', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

type GetMusicRequestRoomTitleResponse = { roomTitle: string };

export const getMusicRequestRoomTitle = (params: { roomId: string }) => {
  const searchParams = new URLSearchParams(params);

  return fetcher<GetMusicRequestRoomTitleResponse>(
    `/music-request/room/title?${searchParams}`,
  );
};

export const createMusicRequestStudent = (params: {
  roomId: string;
  name: string;
}) => {
  return fetcher('/music-request/student', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};
