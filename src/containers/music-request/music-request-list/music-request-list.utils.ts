import { YoutubeVideo } from '@/apis/music-request/musicRequest';
import { head } from 'lodash';

export const hasMusic = (musicList: YoutubeVideo[]) => {
  const music = head(musicList);

  return Boolean(music);
};

export const getMusicRoomImage = (musicList: YoutubeVideo[]) => {
  const music = head(musicList);

  if (!music) {
    return null;
  }
  return `https://i.ytimg.com/vi/${music.musicId}/hqdefault.jpg`;
};

export const getMusicRoomDescription = (musicList: YoutubeVideo[]) => {
  const music = head(musicList);

  if (!music) {
    return null;
  }

  return music.title;
};
