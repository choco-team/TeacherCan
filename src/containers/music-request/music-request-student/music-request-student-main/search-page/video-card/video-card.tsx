import { Button } from '@/components/button';
import { useCreateMusicRequestMusic } from '@/hooks/apis/music-request/use-create-music-request-music';
import { LoaderCircle } from 'lucide-react';
import { useMusicRequestStudentAction } from '../../../music-request-student-provider/music-request-student-provider.hooks';
import { YoutubeVideo } from '../search-page.hooks';

interface VideoCardProps {
  video: YoutubeVideo;
  roomId: string;
  student: string;
}

export default function VideoCard({ video, roomId, student }: VideoCardProps) {
  const { mutate: requestMusic, isPending } = useCreateMusicRequestMusic();
  const { openAlertWithMessage } = useMusicRequestStudentAction();

  const handleRequestMusic = ({
    musicId,
    title,
  }: {
    musicId: string;
    title: string;
  }) => {
    requestMusic(
      {
        roomId,
        student,
        musicId,
        title,
      },
      {
        onSuccess: () => {
          openAlertWithMessage('음악 신청이 완료되었습니다.');
        },
        onError: (error) => {
          openAlertWithMessage(error.message);
        },
      },
    );
  };

  return (
    <li>
      <div className="flex flex-col gap-2">
        <iframe
          className="w-full aspect-video"
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.videoId}
          style={{
            pointerEvents: 'none',
          }}
        />
        <div className="flex flex-row justify-between">
          <div className="flex flex-col w-full mr-4">
            <p className="text-gray-900">{video.title}</p>
          </div>
          <Button
            className="w-[120px]"
            variant="primary-outline"
            onClick={() => {
              handleRequestMusic({
                title: video.title,
                musicId: video.videoId,
              });
            }}
          >
            {isPending ? (
              <LoaderCircle
                size="18px"
                className="animate-spin text-primary-500"
              />
            ) : (
              '신청하기'
            )}
          </Button>
        </div>
      </div>
    </li>
  );
}
