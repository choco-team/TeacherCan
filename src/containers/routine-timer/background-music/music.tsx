import React, { useRef, useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { Music, VolumeX, Volume2 } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Routine } from '../create-routine/routine-types';

type RoutineBackgroundMusicProps = {
  routineId: string;
  isPlaying?: boolean;
};

export default function RoutineBackgroundMusic({
  routineId,
  isPlaying = false,
}: RoutineBackgroundMusicProps) {
  const youtubePlayerRef = useRef<YT.Player | null>(null);
  const [musicData, setMusicData] = useState<{
    videoId: string;
    url?: string;
  } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(30);
  const [routines] = useLocalStorage<Routine[]>('routines', []);

  useEffect(() => {
    if (!routines || !Array.isArray(routines)) {
      setMusicData(null);
      return;
    }

    const currentRoutine = routines.find(
      (routine) => routine.key === routineId,
    );

    if (currentRoutine && currentRoutine.videoId) {
      setMusicData({
        videoId: currentRoutine.videoId,
        url: currentRoutine.url,
      });
    } else {
      setMusicData(null);
    }
  }, [routineId, routines]);

  useEffect(() => {
    if (!youtubePlayerRef.current) return;

    if (isPlaying && musicData?.videoId) {
      youtubePlayerRef.current.playVideo();
    } else {
      youtubePlayerRef.current.pauseVideo();
    }
  }, [isPlaying, musicData]);

  const handleYouTubeReady = (event: YT.PlayerEvent) => {
    youtubePlayerRef.current = event.target;
    event.target.setVolume(volume);

    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const toggleMute = () => {
    if (!youtubePlayerRef.current) return;

    if (isMuted) {
      youtubePlayerRef.current.unMute();
      youtubePlayerRef.current.setVolume(volume);
    } else {
      youtubePlayerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (youtubePlayerRef.current && !isMuted) {
      youtubePlayerRef.current.setVolume(newVolume);
    }
  };

  if (!musicData?.videoId) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg z-10">
        <Music className="w-5 h-5 text-blue-600" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 max-w-48 truncate">
            배경음악
          </span>
          <span className="text-xs text-gray-500">YouTube 음악</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-gray-600" />
            ) : (
              <Volume2 className="w-4 h-4 text-gray-600" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-16 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      <div className="hidden">
        <YouTube
          videoId={musicData.videoId}
          onReady={handleYouTubeReady}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 0,
              loop: 1,
              playlist: musicData.videoId,
              controls: 0,
              showinfo: 0,
              rel: 0,
              iv_load_policy: 3,
              modestbranding: 1,
            },
          }}
        />
      </div>
    </>
  );
}
