// 'use client';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { useEffect } from 'react';
import {
  useCountdownMusicAction,
  useCountdownMusicState,
} from '../../countdown-music-provider/countdown-music-provider.hooks';

export default function SettingMusic() {
  const { isUrlError, inputRef, playBtnRef, defaultValue } =
    useCountdownMusicState();
  const { onClickGetBtn, onClickPlayBtn, pauseMusic } =
    useCountdownMusicAction();

  useEffect(() => {
    return pauseMusic;
  }, []);

  return (
    <div>
      배경 음악
      <div className="grid gap-2">
        <Input
          className={
            isUrlError
              ? 'w-full border-red-500 animate-bounce border-4'
              : 'w-full border-4'
          }
          ref={inputRef}
          type="text"
          defaultValue={defaultValue}
        />
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="primary-outline"
            size="sm"
            type="submit"
            onClick={onClickGetBtn}
          >
            가져오기
          </Button>
          <Button
            variant="primary"
            size="sm"
            ref={playBtnRef}
            onClick={onClickPlayBtn}
          >
            재생
          </Button>
        </div>
      </div>
    </div>
  );
}
