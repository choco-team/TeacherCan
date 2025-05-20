'use client';

import { useEffect, useRef } from 'react';

type AudioPlayerProps = {
  musicUrl: string;
  isPlaying: boolean;
};

function AudioPlayer({ musicUrl, isPlaying }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(musicUrl);
      audio.loop = true; // 반복 재생
      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, [musicUrl]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error('배경음악 재생 실패:', err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return null;
}

export default AudioPlayer;
