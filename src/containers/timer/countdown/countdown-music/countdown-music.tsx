import Lottie from 'lottie-react';
import { cn } from '@/styles/utils';
import musicWaveAnimation from '@/assets/lottie/music-wave.json';
import YouTube from 'react-youtube';
import { useCountdownMusicState } from '../countdown-music-provider/countdown-music-provider.hooks';
import { useCountdownState } from '../countdown-provider/countdown-provider.hooks';

export default function CountdownMusic() {
  const { isMusicUsed, musicAnimationRef, youtubePlayerRef } =
    useCountdownState();
  const {
    music: { videoId, title },
    volumeValue,
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

      <YouTube
        className="hidden"
        onReady={(event: YT.PlayerEvent) => {
          youtubePlayerRef.current = event.target;
          event.target.setVolume(volumeValue);
        }}
        videoId={videoId}
        opts={{
          playerVars: {
            autoplay: 0,
            loop: 1,
          },
        }}
      />
    </>
  );
}
