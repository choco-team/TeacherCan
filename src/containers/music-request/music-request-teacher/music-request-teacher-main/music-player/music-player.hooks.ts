import { useEffect, useRef, useState } from 'react';
import { YouTubeEvent } from 'react-youtube';
import { YoutubeVideo } from '@/apis/music-request/musicRequest';
import { findNextVideIndex } from './music-player.utils';

export type MusicOptions = {
  playerType: 'order' | 'shuffle';
  mediaType: 'video' | 'image';
  currentTime: number;
  duration: number;
  volume: number;
  isPlay: boolean;
};

export type MusicHandler = {
  handleMusicReady: (event: YouTubeEvent) => void;
  handleMusicPlay: (event: YT.PlayerEvent) => void;
  handleMusicEnd: () => void;
  handleMusicPause: () => void;
  handleMusicChange: (order: 'next' | 'prev') => void;
};

export type MusicOptionKeys = keyof MusicOptions;

type Props = {
  musicList: YoutubeVideo[];
  musicCount: number;
  currentVideoIndex: number;
  updateCurrentVideoId: (musicId: string) => void;
};

export const useMusicPlayer = ({
  musicList,
  musicCount,
  currentVideoIndex,
  updateCurrentVideoId,
}: Props) => {
  const youtubePlayerRef = useRef<YT.Player | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearIntervalFunc = () => {
    if (!intervalRef.current) {
      return;
    }

    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const [musicOptions, setMusicOptions] = useState<MusicOptions>({
    playerType: 'order',
    mediaType: 'video',
    currentTime: 0,
    duration: 0,
    volume: 50,
    isPlay: false,
  });

  const updateMusicOption = <K extends MusicOptionKeys>(
    option: K,
    value: MusicOptions[K],
  ) => {
    setMusicOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const handleMusicChange = (order: 'next' | 'prev') => {
    const nextVideoIndex = findNextVideIndex(
      order,
      musicOptions.playerType,
      currentVideoIndex,
      musicCount,
    );

    updateCurrentVideoId(musicList[nextVideoIndex].musicId);
  };

  const handleMusicReady = (event: YouTubeEvent) => {
    youtubePlayerRef.current = event.target;
    youtubePlayerRef.current.setVolume(musicOptions.volume);

    updateMusicOption('currentTime', 0);
    updateMusicOption('duration', event.target.getDuration());
  };

  const handleMusicPlay = (event: YT.PlayerEvent) => {
    clearIntervalFunc();

    updateMusicOption('isPlay', true);

    intervalRef.current = setInterval(() => {
      updateMusicOption('currentTime', event.target.getCurrentTime());
    }, 1000);
  };

  const handleMusicEnd = () => {
    handleMusicChange('next');
  };

  const handleMusicPause = () => {
    updateMusicOption('isPlay', false);
  };

  const musicHandler: MusicHandler = {
    handleMusicReady,
    handleMusicPlay,
    handleMusicEnd,
    handleMusicPause,
    handleMusicChange,
  };

  useEffect(() => {
    if (!youtubePlayerRef.current) {
      return;
    }

    youtubePlayerRef.current.setVolume(musicOptions.volume);
  }, [musicOptions.volume]);

  return { youtubePlayerRef, musicOptions, musicHandler, updateMusicOption };
};
