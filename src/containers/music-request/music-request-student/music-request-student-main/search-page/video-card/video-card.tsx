import { Button } from '@/components/button';
import { createMusic } from '@/utils/api/firebaseAPI';
import { useMusicRequestStudentAction } from '../../../music-request-student-provider/music-request-student-provider.hooks';
import { YoutubeVideo } from '../../../music-request-student-provider/music-request-student-provider';

interface VideoCardProps {
  video: YoutubeVideo;
  roomId: string;
  studentName: string;
}

export default function VideoCard({
  video,
  roomId,
  studentName,
}: VideoCardProps) {
  const { settingVideos, openAlertWithMessage } =
    useMusicRequestStudentAction();

  const handleRequestMusic = async (musicData: {
    videoId: string;
    title: string;
    roomId: string;
    proposer: string;
  }) => {
    try {
      const response = await createMusic(musicData);
      const data = await response.json();
      if (response.ok) {
        openAlertWithMessage(data.message);
      } else if (response.status === 409) {
        openAlertWithMessage(data.message);
      } else {
        throw Error('에러발생');
      }
    } catch (error) {
      throw Error(error.message);
    } finally {
      settingVideos((prev) =>
        prev.map((prevVideo) =>
          prevVideo.videoId === video.videoId
            ? { ...prevVideo, isRequested: true }
            : prevVideo,
        ),
      );
    }
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
            disabled={video.isRequested}
            variant="primary-outline"
            onClick={() => {
              handleRequestMusic({
                roomId,
                title: video.title,
                videoId: video.videoId,
                proposer: studentName,
              });
            }}
          >
            {video.isRequested}
            신청하기
          </Button>
        </div>
      </div>
    </li>
  );
}
