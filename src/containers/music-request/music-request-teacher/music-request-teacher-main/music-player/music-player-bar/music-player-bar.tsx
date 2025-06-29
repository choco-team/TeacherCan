import Image from 'next/image';
import {
  ChevronFirst,
  ChevronLast,
  Loader2,
  Pause,
  Play,
  Server,
  ServerOff,
  Shuffle,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from 'lucide-react';
import { cn } from '@/styles/utils';
import { Slider } from '@/components/slider';
import { MutableRefObject, useState } from 'react';
import { YoutubeVideo } from '@/apis/music-request/musicRequest';
import { Button } from '@/components/button';
import { formatTime } from '../music-player.utils';
import { MusicOptionKeys, MusicOptions } from '../music-player.hooks';

type Props = {
  currentMusic: YoutubeVideo;
  youtubePlayerRef: MutableRefObject<YT.Player>;
  musicOptions: MusicOptions;
  updateMusicOption: <K extends MusicOptionKeys>(
    option: K,
    value: MusicOptions[K],
  ) => void;
  handleMusicChange: (order: 'next' | 'prev') => void;
  sseConnectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  reconnectSse: () => void;
};

export function MusicPlayerBar({
  currentMusic,
  youtubePlayerRef,
  musicOptions,
  updateMusicOption,
  handleMusicChange,
  sseConnectionStatus,
  reconnectSse,
}: Props) {
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverVolume, setHoverVolume] = useState(false);

  const { playerType, currentTime, duration, volume, isPlay } = musicOptions;

  const playVideo = () => {
    if (youtubePlayerRef.current) {
      updateMusicOption('isPlay', true);
      youtubePlayerRef.current.playVideo();
    }
  };

  const pauseVideo = () => {
    if (youtubePlayerRef.current) {
      updateMusicOption('isPlay', false);
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

  const progress = duration === 0 ? 0 : (currentTime / duration) * 100;

  return (
    <div
      className="h-[100px] fixed bottom-0 left-0 right-0 text-gray-700 dark:text-gray-200 bg-gradient-to-r from-primary-100 dark:from-gray-600 to-primary-300 dark:to-gray-800 z-30 shadow-xl"
      onMouseLeave={() => setHoverVolume(false)}
    >
      <div
        className="w-full bg-primary-100 dark:bg-gray-500 h-1 cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverTime(null)}
        onClick={(e) => {
          const progressBar = e.currentTarget;
          const mouseX = e.clientX - progressBar.getBoundingClientRect().left;
          const newTime = (mouseX / progressBar.offsetWidth) * duration;

          updateMusicOption('currentTime', newTime);
          seekTo(newTime);
        }}
      >
        <div
          className="h-full bg-primary-400 dark:bg-gray-200"
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
      <div className="grid grid-cols-[1fr_auto] lg:grid-cols-3 px-8 h-full items-center">
        <div className="flex items-center gap-4">
          <ChevronFirst
            className="cursor-pointer"
            onClick={() => handleMusicChange('prev')}
          />
          {isPlay ? (
            <Pause
              size={36}
              fill="#3f3f46"
              className="cursor-pointer dark:fill-gray-200"
              onClick={pauseVideo}
            />
          ) : (
            <Play
              size={36}
              fill="#3f3f46"
              className="cursor-pointer dark:fill-gray-200"
              onClick={playVideo}
            />
          )}
          <ChevronLast
            className="cursor-pointer"
            onClick={() => handleMusicChange('next')}
          />
          <div className="tabular-nums text-sm text-gray-600 dark:text-gray-200">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        <div className="items-center gap-4 hidden lg:flex">
          {currentMusic ? (
            <>
              <Image
                className="object-cover"
                src={`https://i.ytimg.com/vi/${currentMusic.musicId}/hqdefault.jpg`}
                alt=""
                width={80}
                height={45}
              />
              <div className="truncate flex flex-col">
                <span className="font-bold text-ellipsis overflow-hidden">
                  {currentMusic.title}
                </span>
                <span className="font-light text-gray-600 dark:text-gray-200 text-sm">
                  {currentMusic.studentName}의 신청곡
                </span>
              </div>
            </>
          ) : null}
        </div>
        <div className="flex items-center justify-end gap-4">
          {hoverVolume ? (
            <Slider
              value={[volume]}
              onValueChange={([value]) => {
                updateMusicOption('volume', value);
              }}
              className="w-40 cursor-pointer"
            />
          ) : null}
          {volume === 0 && (
            <VolumeXIcon
              className="cursor-pointer"
              onMouseEnter={() => setHoverVolume(true)}
              onClick={() => updateMusicOption('volume', 50)}
            />
          )}
          {volume < 50 && volume !== 0 && (
            <Volume1Icon
              className="cursor-pointer"
              onMouseEnter={() => setHoverVolume(true)}
              onClick={() => updateMusicOption('volume', 0)}
            />
          )}
          {volume >= 50 && (
            <Volume2Icon
              className="cursor-pointer"
              onMouseEnter={() => setHoverVolume(true)}
              onClick={() => updateMusicOption('volume', 0)}
            />
          )}
          <Shuffle
            className={cn(
              'cursor-pointer',
              playerType === 'shuffle'
                ? 'text-gray-600 dark:text-gray-200'
                : 'text-primary-200 dark:text-gray-600',
            )}
            onClick={() => {
              const toggledOrder = playerType === 'order' ? 'shuffle' : 'order';
              updateMusicOption('playerType', toggledOrder);
            }}
          />
          <div className="flex items-center gap-2 text-sm font-medium">
            {sseConnectionStatus === 'connected' && (
              <span
                title="연결됨"
                className="flex items-center gap-1 text-green-600"
              >
                <Server className="w-4 h-4" />
                <span className="hidden sm:inline">접속됨</span>
              </span>
            )}

            {sseConnectionStatus === 'reconnecting' && (
              <span
                title="재연결"
                className="flex items-center gap-1 text-blue-600"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">접속중..</span>
              </span>
            )}

            {sseConnectionStatus === 'disconnected' && (
              <Button size="sm" variant="gray-ghost" onClick={reconnectSse}>
                <span
                  title="끊김"
                  className="flex items-center gap-1 text-red-500"
                >
                  <ServerOff className="w-4 h-4" />
                  <span className="hidden sm:inline">재시도</span>
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
