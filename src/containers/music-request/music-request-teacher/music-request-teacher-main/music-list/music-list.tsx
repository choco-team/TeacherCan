import { useEffect, useRef } from 'react';
import { YoutubeVideo } from '@/apis/music-request/musicRequest';
import MusicCard from './music-card/music-card';

type Props = {
  videos: YoutubeVideo[];
  roomId: string;
  currentMusicId: string;
  updateCurrentVideoId: (musicId: string) => void;
};

export default function MusicList({
  videos,
  roomId,
  currentMusicId,
  updateCurrentVideoId,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef || !listRef.current) {
      return;
    }

    const listItems = listRef.current.children;

    const currentVideoIndex = videos.findIndex(
      ({ musicId }) => musicId === currentMusicId,
    );

    if (!listItems[currentVideoIndex]) {
      return;
    }

    listItems[currentVideoIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [listRef, currentMusicId]);

  const hasVideo = videos.length > 0;

  return (
    <div
      className="h-full lg:h-[calc(100vh-200px)] overflow-scroll pb-6 pt-2 mt-2 relative"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {hasVideo ? (
        <div
          className="flex flex-col gap-[1px] mb-12 bg-gray-200"
          ref={listRef}
        >
          {videos.map((video) => (
            <MusicCard
              video={video}
              roomId={roomId}
              key={video.musicId}
              currentMusicId={currentMusicId}
              updateCurrentVideoId={updateCurrentVideoId}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-12 justify-center items-center">
          <div className="text-center text-sm text-gray-500">
            <span>신청된 음악이 없어요.</span>
            <br />
            <span>방 정보에서 QR코드를 통해 학생을 초대해보세요.</span>
          </div>
        </div>
      )}
    </div>
  );
}
