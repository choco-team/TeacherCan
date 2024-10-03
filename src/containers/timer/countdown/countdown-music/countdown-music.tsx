import Lottie from 'lottie-react';
import { cn } from '@/styles/utils';
import musicWaveAnimation from '@/assets/lottie/music-wave.json';
import { useCountdownMusicState } from '../countdown-music-provider/countdown-music-provider.hooks';
import { useCountdownState } from '../countdown-provider/countdown-provider.hooks';

export default function CountdownMusic() {
  const { isMusicUsed, iframeRef, musicAnimationRef } = useCountdownState();
  const { musicTitle } = useCountdownMusicState();

  return (
    <>
      <div
        className={cn(
          'absolute left-8 bottom-8 flex items-center gap-x-4 text-lg text-text',
          (!isMusicUsed || !iframeRef.current?.src) && 'hidden',
        )}
      >
        <Lottie
          lottieRef={musicAnimationRef}
          animationData={musicWaveAnimation}
          autoPlay={false}
          className="w-10"
        />
        {musicTitle}
      </div>
      <iframe
        className="hidden"
        title="youtube"
        ref={iframeRef}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
    </>
  );
}
