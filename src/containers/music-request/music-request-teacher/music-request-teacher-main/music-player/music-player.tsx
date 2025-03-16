import { YoutubeVideo } from '@/apis/music-request/musicRequest';
import { MusicPlayerBar } from './music-player-bar/music-player-bar';
import { useMusicPlayer } from './music-player.hooks';
import { MusicVideo } from './music-video/music-video';

type Props = {
  musicList: YoutubeVideo[];
  currentVideoIndex: number;
  updateCurrentVideoIndex: (index: number) => void;
};

export default function MusicPlayer({
  musicList,
  currentVideoIndex,
  updateCurrentVideoIndex,
}: Props) {
  const currentMusic =
    musicList.length > 0 ? musicList[currentVideoIndex] : null;

  const { youtubePlayerRef, musicOptions, updateMusicOption, musicHandler } =
    useMusicPlayer({
      currentVideoIndex,
      updateCurrentVideoIndex,
      musicCount: musicList.length,
    });

  if (!currentMusic) {
    // TODO:(김홍동) 아직 비디오가 없는 경우
    return null;
  }

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
