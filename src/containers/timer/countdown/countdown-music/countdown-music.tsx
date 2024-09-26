import { useCountdownMusicState } from '../countdown-music-provider/countdown-music-provider.hooks';

export default function CountdownMusic() {
  const { isMusicUsed, iframeRef, musicTitle } = useCountdownMusicState();
  return (
    <div>
      <div>배경음악: {isMusicUsed ? musicTitle : ''}</div>
      <iframe
        className="hidden"
        title="youtube"
        ref={iframeRef}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
    </div>
  );
}
