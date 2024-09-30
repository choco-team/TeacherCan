// 'use client';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { useEffect } from 'react';
import {
  useCountdownMusicAction,
  useCountdownMusicState,
} from '../../countdown-music-provider/countdown-music-provider.hooks';
import { useCountdownState } from '../../countdown-provider/countdown-provider.hooks';

export default function SettingMusic() {
  const { isUrlError, defaultValue, inputRef, didMount, musicTitle } =
    useCountdownMusicState();
  const {
    getYouTubeMusicURL,
    toggleMusicUsedState,
    toggleMusicPlayState,
    pauseMusic,
  } = useCountdownMusicAction();
  const { isActive, isMusicUsed, isMusicPlay } = useCountdownState();

  useEffect(() => {
    if (didMount.current) {
      didMount.current = false;
      if (!isActive) {
        return pauseMusic;
      }
    } else {
      didMount.current = true;
    }
    return undefined;
  }, [didMount, isActive, pauseMusic]);

  return (
    <div>
      배경 음악
      <div className="grid gap-2">
        <div className="grid grid-cols-4 gap-2">
          <Input
            className={
              isUrlError
                ? 'w-full h-9 border-2 col-span-3 border-red-500 animate-bounce  '
                : 'w-full h-9 border-2 col-span-3'
            }
            ref={inputRef}
            type="text"
            defaultValue={defaultValue}
          />
          <Button
            variant="primary-outline"
            size="sm"
            onClick={getYouTubeMusicURL}
            disabled={isActive}
          >
            가져오기
          </Button>
        </div>
        <div
          className={
            isMusicUsed
              ? 'overflow-x-auto text-center border-2 rounded-lg h-8 text-primary border-primary '
              : 'overflow-x-auto text-center border-2 rounded-lg h-8 text-gray-400'
          }
        >
          {musicTitle}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={isMusicUsed ? 'primary' : 'primary-outline'}
            size="sm"
            onClick={toggleMusicUsedState}
          >
            {isMusicUsed ? '음악 빼기' : '음악 넣기'}
          </Button>
          {isActive ? (
            <Button
              variant="primary-outline"
              size="sm"
              onClick={toggleMusicPlayState}
              disabled
            >
              타이머 실행중..
            </Button>
          ) : (
            <Button
              variant={isMusicPlay ? 'primary' : 'primary-outline'}
              size="sm"
              onClick={toggleMusicPlayState}
            >
              {isMusicPlay ? '일시정지' : '미리듣기'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
