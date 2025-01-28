import { Button } from '@/components/button';
import { createMusic } from '@/utils/api/firebaseAPI';
import { useMusicRequestStudentAction } from '../../../music-request-student-provider/music-request-student-provider.hooks';

interface VideoCardProps {
  video: any;
  roomId: any;
  studentName: any;
}

export default function VideoCard({
  video,
  roomId,
  studentName,
}: VideoCardProps) {
  const { settingVideos } = useMusicRequestStudentAction();

  const handleRequestMusic = async (musicData) => {
    try {
      await createMusic(musicData);
      settingVideos((prev) =>
        prev.map((prevVideo) =>
          prevVideo.videoId === video.videoId
            ? { ...prevVideo, isRequested: true }
            : prevVideo,
        ),
      );
    } catch (error) {
      throw Error(error.message);
    }
  };

  return (
    <li key={video.videoId}>
      <div className="flex flex-col mt-8">
        <iframe
          className="w-full"
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.videoId}
        />
        <div className="flex flex-row justify-between m-2">
          <div className="flex flex-col w-full mr-4">
            <p className="font-semibold">{video.title}</p>
            <p className="text-xs text-gray-600	text-right">
              {video.channelTitle} &middot; {video.publishedAt}
            </p>
          </div>
          <Button
            disabled={video.isRequested}
            variant="primary"
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
