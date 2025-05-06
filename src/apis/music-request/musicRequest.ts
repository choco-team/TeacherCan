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

type CreateMusicRequestMusicResponse = {
  musicId: string;
  roomId: string;
  studentId: number;
  title: string;
  id: number;
  timeStamp: string;
};

export const createMusicRequestMusic = (params: {
  roomId: string;
  student: string;
  musicId: string;
  title: string;
}) => {
  return fetcher<CreateMusicRequestMusicResponse>('/music-request/music', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

export type YoutubeVideo = {
  musicId: string;
  title: string;
  student: string;
  timeStamp: string;
};

export type GetMusicRequestRoomResponse = {
  roomTitle: string;
  musicList: YoutubeVideo[];
};

export const getMusicRequestRoom = (params: { roomId: string }) => {
  const searchParams = new URLSearchParams(params);

  return fetcher<GetMusicRequestRoomResponse>(`/music-request?${searchParams}`);
};

export const DeleteMusicRequestMusic = (params: {
  roomId: string;
  musicId: string;
}) => {
  return fetcher<{}>('/music-request/music', {
    method: 'DELETE',
    body: JSON.stringify(params),
  });
};
