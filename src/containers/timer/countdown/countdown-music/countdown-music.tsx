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
          'max-md:hidden absolute left-4 bottom-4 lg:left-8 lg:bottom-8 flex items-center gap-x-2 lg:gap-x-4',
          (!isMusicUsed || !videoId) && 'hidden',
        )}
      >
        <Lottie
          lottieRef={musicAnimationRef}
          animationData={musicWaveAnimation}
          autoPlay={false}
          className="w-6 lg:w-10"
        />
        <span className="text-xs lg:text-lg text-text">{title}</span>
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
