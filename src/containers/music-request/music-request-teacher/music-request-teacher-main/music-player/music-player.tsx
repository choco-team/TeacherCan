import { YoutubeVideo } from '@/apis/music-request/musicRequest';
import { MusicPlayerBar } from './music-player-bar/music-player-bar';
import { useMusicPlayer } from './music-player.hooks';
import { MusicVideo } from './music-video/music-video';

type Props = {
  musicList: YoutubeVideo[];
  currentMusicId: string;
  updateCurrentVideoId: (musicId: string) => void;
};

export default function MusicPlayer({
  musicList,
  currentMusicId,
  updateCurrentVideoId,
}: Props) {
  const currentVideoIndex = musicList.findIndex(
    ({ musicId }) => musicId === currentMusicId,
  );

  const currentMusic =
    musicList.length > 0 ? musicList[currentVideoIndex] : null;

  const { youtubePlayerRef, musicOptions, updateMusicOption, musicHandler } =
    useMusicPlayer({
      musicList,
      musicCount: musicList.length,
      currentVideoIndex,
      updateCurrentVideoId,
    });

  return (
    <>
      <MusicVideo
        currentMusic={currentMusic}
        musicOptions={musicOptions}
        musicHandler={musicHandler}
        updateMusicOption={updateMusicOption}
      />
      <MusicPlayerBar
        youtubePlayerRef={youtubePlayerRef}
        currentMusic={currentMusic}
        musicOptions={musicOptions}
        updateMusicOption={updateMusicOption}
        handleMusicChange={musicHandler.handleMusicChange}
      />
    </>
  );
}
