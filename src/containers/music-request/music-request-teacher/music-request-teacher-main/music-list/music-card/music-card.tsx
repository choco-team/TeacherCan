import { Play, X } from 'lucide-react';
import Image from 'next/image';
import { cva } from 'class-variance-authority';
import { YoutubeVideo } from '@/apis/music-request/musicRequest';

const layoutVariant = cva(
  'p-2 grid grid-cols-[auto_1fr_auto] gap-2 cursor-pointer w-full',
  {
    variants: {
      isSelected: {
        true: 'bg-gray-100',
        false: 'bg-white',
      },
    },
  },
);

type Props = {
  video: YoutubeVideo;
  roomId: string;
  index: number;
  currentVideoIndex: number;
  updateCurrentVideoIndex: (index: number) => void;
};

export default function MusicCard({
  video,
  roomId,
  index,
  currentVideoIndex,
  updateCurrentVideoIndex,
}: Props) {
  const isSelectedMusic =
    currentVideoIndex !== null && currentVideoIndex === index;

  const handleDeleteMusic = async () => {
    // TODO:(김홍동) 음악 지우기
    console.log(roomId);
    // try {
    //   deleteMusic(roomId, video);
    // } catch (e) {
    //   throw new Error(e.message);
    // }
  };

  const handlePlayButton = () => {
    updateCurrentVideoIndex(index);
  };

  return (
    <div
      className={layoutVariant({
        isSelected: isSelectedMusic,
      })}
      onClick={() => handlePlayButton()}
    >
      <div className="relative w-12 h-12">
        <Image
          className="object-cover aspect-square rounded-sm"
          src={`https://i.ytimg.com/vi/${video.musicId}/hqdefault.jpg`}
          alt=""
          width={600}
          height={600}
        />
        {isSelectedMusic ? (
          <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none">
            <Play size={24} fill="#52525b" color="#52525b" />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col truncate">
        <span className="font-medium text-sm truncate">{video.title}</span>
        <span className="font-light text-gray-600 text-xs">
          {video.student}의 신청곡
        </span>
      </div>
      <div className="flex flex-col justify-between ">
        {/* TODO:(김홍동) 곡 삭제되면 index가 바뀌는 문제 해결 및 마지막 영상 삭제 시 에러 발생하는 거 해결 */}
        <button type="button" onClick={() => handleDeleteMusic()}>
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
