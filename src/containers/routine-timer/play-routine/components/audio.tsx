'use client';

import { useEffect, useRef, useState } from 'react';

type AudioPlayerProps = {
  musicUrl: string;
  isPlaying: boolean;
};

function AudioPlayer({ musicUrl, isPlaying }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      const audio = new Audio();
      audio.loop = true;

      audio.onerror = () => {
        setAudioError(
          `오디오 로드 실패: ${audio.error?.message || '알 수 없는 오류'}`,
        );
        console.error('오디오 로드 실패:', audio.error);
      };

      audio.src = musicUrl;
      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && audioRef.current.src !== musicUrl) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = musicUrl;

      if (wasPlaying) {
        audioRef.current.play().catch((err) => {
          console.error('소스 변경 후 재생 실패:', err);
        });
      }
    }
  }, [musicUrl]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && audioRef.current.paused) {
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error('배경음악 재생 실패:', err);
          setAudioError(`배경음악 재생 실패: ${err.message}`);
        });
      }
    } else if (!isPlaying && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  if (audioError) {
    return <div className="text-red-500 text-sm">🔊 {audioError}</div>;
  }

  return null;
}

export default AudioPlayer;
