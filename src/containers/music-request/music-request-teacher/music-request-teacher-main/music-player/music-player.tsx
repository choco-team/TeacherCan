import YouTube from 'react-youtube';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cva } from 'class-variance-authority';
import {
  ChevronFirst,
  ChevronLast,
  Pause,
  Play,
  Shuffle,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from 'lucide-react';
import { cn } from '@/styles/utils';
import { Slider } from '@/components/slider';
import {
  useMusicRequestTeacherAction,
  useMusicRequestTeacherState,
} from '../../music-request-teacher-provider/music-request-teacher-provider.hooks';
import { formatTime } from './music-player.utiles';

const mediaTypeButtonVariants = cva(
  'px-4 h-8 rounded-3xl text-white font-normal',
  {
    variants: {
      selected: {
        true: 'bg-gray-400',
        false: 'bg-gray-200',
      },
    },
  },
);

export default function MusicPlayer() {
  const { videos, numberOfVideos, currentMusicIndex, maxPlayCount } =
    useMusicRequestTeacherState();
  const { setCurrentMusicByIndex, settingIsVideoLoading } =
    useMusicRequestTeacherAction();
  const [playOrder, setPlayOrder] = useState<'inOrder' | 'shuffle'>('inOrder');
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const youtubePlayerRef = useRef<YT.Player | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverVolume, setHoverVolume] = useState(false);
  const [volume, setVolume] = useState(50);

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

  const hasVideos = videos.length > 0;

  useEffect(() => {
    if (!youtubePlayerRef.current) {
      return;
    }

    youtubePlayerRef.current.setVolume(volume);
  }, [volume]);

  if (!hasVideos) {
    // TODO:(김홍동) 아직 비디오 신청이 없는 경우 대응
    return null;
  }

  const currentVideo = videos[currentMusicIndex];
  const progress = duration === 0 ? 0 : (currentTime / duration) * 100;

  const clearIntervalFunc = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const playVideo = () => {
    if (youtubePlayerRef.current) {
      setIsPlay(true);
      youtubePlayerRef.current.playVideo();
    }
  };

  const pauseVideo = () => {
    if (youtubePlayerRef.current) {
      setIsPlay(false);
      youtubePlayerRef.current.pauseVideo();
    }
  };

  const seekTo = (time: number) => {
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.seekTo(time, true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const progressBar = e.currentTarget as HTMLDivElement;
    const mouseX = e.clientX - progressBar.getBoundingClientRect().left;
    const newTime = (mouseX / progressBar.offsetWidth) * duration;
    setHoverTime(newTime);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-200 w-fit h-8 my-0 mx-auto rounded-3xl">
        <button
          type="button"
          className={mediaTypeButtonVariants({
            selected: mediaType === 'video',
          })}
          onClick={() => setMediaType('video')}
        >
          영상
        </button>
        <button
          type="button"
          className={mediaTypeButtonVariants({
            selected: mediaType === 'image',
          })}
          onClick={() => setMediaType('image')}
        >
          이미지
        </button>
      </div>
      <div className="aspect-video relative">
        <YouTube
          className="aspect-video"
          iframeClassName="w-full h-full"
          onReady={(event: YT.PlayerEvent) => {
            youtubePlayerRef.current = event.target;
            settingIsVideoLoading(false);
            setCurrentTime(0);
            setDuration(event.target.getDuration());
          }}
          onPlay={(event: YT.PlayerEvent) => {
            setIsPlay(true);
            clearIntervalFunc();
            intervalRef.current = setInterval(() => {
              setCurrentTime(event.target.getCurrentTime());
            }, 1000);
          }}
          onEnd={() => {
            if (playOrder === 'shuffle') {
              handleMusicShuffle();
            } else if (playOrder === 'inOrder') {
              handleMusicPlay(1);
            }
          }}
          onPause={() => setIsPlay(false)}
          videoId={currentVideo.videoId}
          opts={{
            playerVars: {
              autoplay: 1,
              loop: 0,
              controls: 0,
            },
          }}
        />

        {mediaType === 'image' ? (
          <Image
            className="absolute top-0 bottom-0 left-0 right-0"
            src={`https://img.youtube.com/vi/${currentVideo.videoId}/maxresdefault.jpg`}
            alt={currentVideo.title}
            fill
          />
        ) : null}
      </div>
      <div
        className="fixed bottom-0 left-0 right-0 text-gray-700 bg-gradient-to-r from-primary-100 to-primary-300 z-[100] shadow-xl"
        onMouseLeave={() => setHoverVolume(false)}
      >
        <div
          className="w-full bg-primary-100 h-1 cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverTime(null)}
          onClick={(e) => {
            const progressBar = e.currentTarget;
            const mouseX = e.clientX - progressBar.getBoundingClientRect().left;
            const newTime = (mouseX / progressBar.offsetWidth) * duration;
            setCurrentTime(newTime);
            seekTo(newTime);
          }}
        >
          <div
            className="h-full bg-primary-400"
            style={{ width: `${progress}%` }}
          />
          {hoverTime !== null && (
            <div
              className="absolute top-[-30px] left-0 text-xs bg-gray-600 text-white px-2 py-1 rounded"
              style={{
                left: `${(hoverTime / duration) * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 px-8 py-6">
          <div className="flex items-center gap-4">
            <ChevronFirst
              className="cursor-pointer"
              onClick={() => handleMusicPlay(-1)}
            />
            {isPlay ? (
              <Pause
                size={36}
                fill="#3f3f46"
                className="cursor-pointer"
                onClick={pauseVideo}
              />
            ) : (
              <Play
                size={36}
                fill="#3f3f46"
                className="cursor-pointer"
                onClick={playVideo}
              />
            )}
            <ChevronLast
              className="cursor-pointer"
              onClick={() => handleMusicPlay(1)}
            />
            <div className="tabular-nums text-sm text-gray-600">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src={`https://img.youtube.com/vi/${currentVideo.videoId}/maxresdefault.jpg`}
              alt={currentVideo.title}
              width={80}
              height={45}
            />
            <div className="truncate flex flex-col">
              <span className="font-bold">{currentVideo.title}</span>
              <span className="font-light text-gray-600 text-sm">
                {currentVideo.proposer}의 신청곡
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-4">
            {hoverVolume ? (
              <Slider
                value={[volume]}
                onValueChange={([value]) => {
                  setVolume(value);
                }}
                className="w-40 cursor-pointer"
              />
            ) : null}
            {volume === 0 && (
              <VolumeXIcon
                className="cursor-pointer"
                onMouseEnter={() => setHoverVolume(true)}
                onClick={() => setVolume(50)}
              />
            )}
            {volume < 50 && volume !== 0 && (
              <Volume1Icon
                className="cursor-pointer"
                onMouseEnter={() => setHoverVolume(true)}
                onClick={() => setVolume(0)}
              />
            )}
            {volume >= 50 && (
              <Volume2Icon
                className="cursor-pointer"
                onMouseEnter={() => setHoverVolume(true)}
                onClick={() => setVolume(0)}
              />
            )}
            <Shuffle
              className={cn(
                'cursor-pointer',
                playOrder === 'shuffle' ? 'text-gray-600' : 'text-primary-200',
              )}
              onClick={() => togglePlayorder()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
