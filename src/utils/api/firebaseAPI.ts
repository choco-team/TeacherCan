import { firebaseDB } from '@/services/firebase';
import { ref, update } from 'firebase/database';

const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type YoutubeVideo = {
  musicId: string;
  videoId: string;
  title: string;
  proposer: string;
  playCount: number;
};

export const getRoomTitle = async (id: string) => {
  try {
    const res = await fetch(
      `${originURL}/api/firebase/music-request/room?roomId=${id}`,
      {
        cache: 'force-cache',
      },
    );
    const json = await res.json();
    if (!res.ok) {
      throw new Error('응답이 존재하지 않습니다.');
    }
    return json.roomTitle;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const createStudentName = async (
  roomId: string,
  studentName: string,
) => {
  const response = await fetch(
    `${originURL}/api/firebase/music-request/students`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomId, studentName }),
    },
  );
  const json = await response.json();
  return json.studentName;
};

export const createRoom = async (roomTitle: string) => {
  const response = await fetch(`${originURL}/api/firebase/music-request/room`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ roomTitle }),
  });
  const json = await response.json();
  return json.roomId;
};

export const createMusic = async (musicData: object) => {
  try {
    const response = await fetch(
      `${originURL}/api/firebase/music-request/musics`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(musicData),
      },
    );

    return response;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const deleteMusic = async (roomId: string, video: YoutubeVideo) => {
  try {
    const updates: any = {};
    updates[`musicRooms/${roomId}/musics/videoIds/${video.videoId}`] = null;
    updates[`musicRooms/${roomId}/musics/list/${video.musicId}`] = null;
    await update(ref(firebaseDB), updates);
  } catch (error) {
    throw new Error(error.message);
  }
};
