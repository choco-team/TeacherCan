import { useEffect, useRef } from 'react';
import { YoutubeVideo } from '@/apis/music-request/musicRequest';
import MusicCard from './music-card/music-card';

type Props = {
  videos: YoutubeVideo[];
  roomId: string;
  currentVideoIndex: number;
  updateCurrentVideoIndex: (index: number) => void;
};

export default function MusicList({
  videos,
  roomId,
  currentVideoIndex,
  updateCurrentVideoIndex,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO:(김홍동) 0 대신 현재 클릭한 비디오
    if (!listRef || !listRef.current) {
      return;
    }

    const listItems = listRef.current.children;

    if (!listItems[0]) {
      return;
    }

    listItems[0].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [listRef, 0]);

  const hasVideo = videos.length > 0;

  return (
    <div className="h-full lg:h-[calc(100vh-200px)] overflow-scroll py-4">
      {hasVideo ? (
        <div className="flex flex-col gap-[1px] bg-gray-200" ref={listRef}>
          {videos.map((video, index) => (
            <MusicCard
              video={video}
              roomId={roomId}
              key={video.musicId}
              index={index}
              currentVideoIndex={currentVideoIndex}
              updateCurrentVideoIndex={updateCurrentVideoIndex}
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
