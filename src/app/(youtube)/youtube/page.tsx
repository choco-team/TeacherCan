'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';

import { Heading1 } from '@/components/ui/Heading';
import { useRef, useState } from 'react';

export default function Page() {
  const [isPlay, setIsplay] = useState(false);
  const inputRef = useRef<HTMLInputElement>();
  const iframeRef = useRef<HTMLIFrameElement>();
  const playBtnRef = useRef<HTMLButtonElement>();

  const onClickTake = () => {
    const videoId = inputRef.current.value.split('v=')[1].split('&')[0];
    iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&enablejsapi=1&autohide=0`;
    setIsplay(true);
    playBtnRef.current.innerHTML = '일시정지';
  };

  const onClickPlay = () => {
    const postMessage = isPlay ? 'pauseVideo' : 'playVideo';
    playBtnRef.current.innerHTML = isPlay ? '재생' : '일시정지';
    iframeRef.current.contentWindow.postMessage(
      `{"event":"command","func":"${postMessage}"}`,
      '*',
    );
    setIsplay(!isPlay);
  };

  return (
    <div className="inline-flex flex-col gap-y-10 p-8">
      <Heading1 className="text-primary">유투브 음원 재생하기!</Heading1>
      <div className="inline-grid grid-cols-3 gap-2">
        <Input
          ref={inputRef}
          type="text"
          defaultValue="https://www.youtube.com/watch?v=3AoruwUKQ3I"
        />
        <Button type="submit" onClick={onClickTake}>
          가져오기
        </Button>
        <Button ref={playBtnRef} onClick={onClickPlay} variant="secondary">
          재생
        </Button>
      </div>
      <iframe
        className="hidden"
        title="youtube"
        ref={iframeRef}
        width="500"
        height="50"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
    </div>
  );
}
