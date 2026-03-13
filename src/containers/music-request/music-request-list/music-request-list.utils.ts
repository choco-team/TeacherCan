import { YoutubeVideo } from '@/apis/music-request/musicRequest';

export const hasMusic = (musicList: YoutubeVideo[]) => {
  return musicList.length > 0;
};

export const getMusicRoomImage = (musicList: YoutubeVideo[]) => {
  const music = musicList[0];

  if (!music) {
    return null;
  }
  return `https://i.ytimg.com/vi/${music.musicId}/hqdefault.jpg`;
};

export const getMusicRoomDescription = (musicList: YoutubeVideo[]) => {
  const music = musicList[0];

  if (!music) {
    return null;
  }

  return music.title;
};
