import { Button } from '@/components/button';
import {
  Music,
  Video,
} from '../../../countdown-music-provider/countdown-music-provider';
import { useCountdownMusicAction } from '../../../countdown-music-provider/countdown-music-provider.hooks';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const { controlMusic, controlOpenMusicSearch, controlIsPlayingPreview } =
    useCountdownMusicAction();

  const handleMusic = async (music: Music) => {
    try {
      controlMusic(music);
      controlOpenMusicSearch(false);
      controlIsPlayingPreview(false);
    } catch (error) {
      throw Error(error.message);
    }
  };

  return (
    <li key={video.videoId}>
      <div className="flex flex-col">
        <iframe
          className="w-full"
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.videoId}
        />
        <div className="flex flex-row justify-between m-2">
          <div className="flex flex-col mr-4 truncate">
            <p className="font-semibold truncate">{video.title}</p>
            <p className="text-xs text-gray-600	text-right truncate">
              {video.channelTitle}
            </p>
            <p className="text-xs text-gray-600	text-right truncate">
              {video.publishedAt}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              handleMusic({
                title: video.title,
                videoId: video.videoId,
              });
            }}
          >
            적용
          </Button>
        </div>
      </div>
    </li>
  );
}
