// 'use client';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import {
  useCountdownMusicAction,
  useCountdownMusicState,
} from '../../countdown-music-provider/countdown-music-provider.hooks';

export default function SettingMusic() {
  const { isUrlError, inputRef, playBtnRef } = useCountdownMusicState();
  const { onClickGetBtn, onClickPlayBtn } = useCountdownMusicAction();

  return (
    <div>
      배경 음악
      <div className="flex-col">
        <Input
          className={
            isUrlError
              ? 'w-full border-red-500 animate-bounce border-4'
              : 'w-full border-4'
          }
          ref={inputRef}
          type="text"
          defaultValue="https://www.youtube.com/watch?v=rmtNOh6GJW8"
        />
        <div>
          <Button className="w-1/3 mr-1" type="submit" onClick={onClickGetBtn}>
            가져오기
          </Button>
          <Button
            className="w-1/3"
            ref={playBtnRef}
            onClick={onClickPlayBtn}
            variant="secondary"
          >
            재생
          </Button>
        </div>
      </div>
    </div>
  );
}
