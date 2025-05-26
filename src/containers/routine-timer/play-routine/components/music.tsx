import React, { useRef, useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { Music, VolumeX, Volume2 } from 'lucide-react';

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
    title: string;
  } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(30); // 기본 볼륨 30%

  // 루틴 시작 시 저장된 음악 정보 불러오기
  useEffect(() => {
    const savedMusicData = localStorage.getItem(`routine-music-${routineId}`);
    if (savedMusicData) {
      try {
        const parsedData = JSON.parse(savedMusicData);
        setMusicData(parsedData);
      } catch (error) {
        console.error('Failed to parse music data:', error);
      }
    }
  }, [routineId]);

  // 루틴 시작/중지에 따른 음악 재생 제어
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

    // 루틴이 시작 중이면 바로 재생
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

  // 음악 데이터가 없으면 렌더링하지 않음
  if (!musicData?.videoId) {
    return null;
  }

  return (
    <>
      {/* 음악 정보 표시 (화면 하단) */}
      <div className="fixed bottom-4 left-4 flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg z-10">
        <Music className="w-5 h-5 text-blue-600" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 max-w-48 truncate">
            {musicData.title}
          </span>
          <span className="text-xs text-gray-500">배경음악</span>
        </div>

        {/* 볼륨 컨트롤 */}
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

      {/* 숨겨진 YouTube 플레이어 */}
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
              playlist: musicData.videoId, // 무한 반복을 위한 플레이리스트 설정
              controls: 0,
              showinfo: 0,
              rel: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              // origin 설정 완전히 제거됨
            },
          }}
        />
      </div>
    </>
  );
}
