import YouTube from 'react-youtube';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Switch } from '@/components/switch';
import { Label } from '@/components/label';
import {
  useMusicRequestTeacherAction,
  useMusicRequestTeacherState,
} from '../../music-request-teacher-provider/music-request-teacher-provider.hooks';

export default function MusicPlayer() {
  const {
    videos,
    numberOfVideos,
    currentMusicIndex,
    maxPlayCount,
    isVideoLoading,
  } = useMusicRequestTeacherState();
  const { setCurrentMusicByIndex, settingIsVideoLoading } =
    useMusicRequestTeacherAction();
  const [playOrder, setPlayOrder] = useState<'inOrder' | 'shuffle'>('inOrder');
  const youtubePlayerRef = useRef<YT.Player>(null);

  const handleMusicShuffle = () => {
    let randomIndex = Math.floor(Math.random() * (numberOfVideos - 1));
    let repeatCount = 0;
    while (videos[randomIndex].playCount === maxPlayCount) {
      if (repeatCount === numberOfVideos) {
        break;
      }
      if (randomIndex !== numberOfVideos - 1) {
        randomIndex += 1;
      } else {
        randomIndex = 0;
      }
      repeatCount += 1;
    }
    setCurrentMusicByIndex(randomIndex);
  };

  const handleMusicPlay = (order: 1 | -1) => {
    if (playOrder === 'shuffle') {
      handleMusicShuffle();
      return;
    }
    let nextMusicIndex;
    if (order === 1 && currentMusicIndex === numberOfVideos - 1) {
      nextMusicIndex = 0;
    } else if (order === -1 && currentMusicIndex === 0) {
      nextMusicIndex = numberOfVideos - 1;
    } else {
      nextMusicIndex = currentMusicIndex + order;
    }
    setCurrentMusicByIndex(nextMusicIndex);
  };

  const togglePlayorder = () => {
    setPlayOrder((prev) => (prev === 'inOrder' ? 'shuffle' : 'inOrder'));
  };

  return (
    <div className="p-4">
      <Label className="flex items-center gap-x-2">
        <span>랜덤 재생하기</span>
        <Switch onClick={() => togglePlayorder()} />
      </Label>
      <div className="flex flex-row justify-between mt-4">
        <button
          disabled={isVideoLoading}
          type="button"
          onClick={() => handleMusicPlay(-1)}
        >
          <ChevronsLeft />
        </button>
        {videos.length > 0 && videos[currentMusicIndex].videoId && (
          <YouTube
            onReady={(event: YT.PlayerEvent) => {
              youtubePlayerRef.current = event.target;
              settingIsVideoLoading(false);
            }}
            onEnd={() => {
              if (playOrder === 'shuffle') {
                handleMusicShuffle();
              } else if (playOrder === 'inOrder') {
                handleMusicPlay(1);
              }
            }}
            videoId={videos[currentMusicIndex].videoId}
            opts={{
              playerVars: {
                autoplay: 1,
                loop: 0,
              },
            }}
            className="aspect-video"
          />
        )}
        <button
          disabled={isVideoLoading}
          type="button"
          onClick={() => handleMusicPlay(1)}
        >
          <ChevronsRight />
        </button>
      </div>
    </div>
  );
}
