import YouTube from 'react-youtube';
import { Button } from '@/components/button';
import { useRef, useState } from 'react';
import {
  useMusicRequestTeacherAction,
  useMusicRequestTeacherState,
} from '../../music-request-teacher-provider/music-request-teacher-provider.hooks';

export default function MusicPlayer() {
  const { videos, numberOfVideos, currentMusicIdx } =
    useMusicRequestTeacherState();
  const { settingVideos, settingCurrentMusicIdx } =
    useMusicRequestTeacherAction();
  const [fulledPlayCount, setFulledPlayCount] = useState(0);
  const youtubePlayerRef = useRef<YT.Player>(null);

  const createRandomIdx = () => {
    let randomIdx = Math.floor(Math.random() * (numberOfVideos - 1));
    let repeatCount = 0;
    while (videos[randomIdx].playCount !== fulledPlayCount) {
      if (repeatCount === numberOfVideos) {
        randomIdx = Math.floor(Math.random() * (numberOfVideos - 1));
        setFulledPlayCount((prev) => prev + 1);
        break;
      }
      if (randomIdx !== numberOfVideos - 1) {
        randomIdx += 1;
      } else {
        randomIdx = 0;
      }
      repeatCount += 1;
    }
    settingVideos((prevVideos) =>
      prevVideos.map((video, i) =>
        i === randomIdx ? { ...video, playCount: video.playCount + 1 } : video,
      ),
    );
    return randomIdx;
  };

  const handleMusicShuffle = () => {
    const randomIdx = createRandomIdx();
    settingCurrentMusicIdx(randomIdx);
  };

  return (
    <div className="m-4">
      {videos.length > 0 && videos[currentMusicIdx].videoId && (
        <YouTube
          onReady={(event: YT.PlayerEvent) => {
            youtubePlayerRef.current = event.target;
          }}
          videoId={videos[currentMusicIdx].videoId}
          opts={{
            playerVars: {
              autoplay: 0,
              loop: 0,
            },
            width: '100%',
            height: '100%',
          }}
        />
      )}
      <Button onClick={() => handleMusicShuffle()}>노래 셔플</Button>
    </div>
  );
}
