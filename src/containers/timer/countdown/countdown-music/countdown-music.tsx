import Lottie from 'lottie-react';
import { cn } from '@/styles/utils';
import musicWaveAnimation from '@/assets/lottie/music-wave.json';
import { useCountdownMusicState } from '../countdown-music-provider/countdown-music-provider.hooks';
import { useCountdownState } from '../countdown-provider/countdown-provider.hooks';

export default function CountdownMusic() {
  const { isMusicUsed, iframeRef, musicAnimationRef } = useCountdownState();
  const {
    music: { videoId, title },
  } = useCountdownMusicState();

  return (
    <>
      <div
        className={cn(
          'absolute left-8 bottom-8 flex items-center gap-x-4 text-lg text-text',
          (!isMusicUsed || !videoId) && 'hidden',
        )}
      >
        <Lottie
          lottieRef={musicAnimationRef}
          animationData={musicWaveAnimation}
          autoPlay={false}
          className="w-10"
        />
        {title}
      </div>
      <iframe
        className="hidden"
        title="youtube"
        ref={iframeRef}
        src={
          videoId
            ? `https://www.youtube.com/embed/${videoId}?loop=1&playlist=${videoId}&enablejsapi=1`
            : undefined
        }
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
    </>
  );
}
