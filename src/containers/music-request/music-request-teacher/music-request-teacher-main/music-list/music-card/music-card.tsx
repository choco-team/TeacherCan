import { Play, X } from 'lucide-react';
import Image from 'next/image';
import { cva } from 'class-variance-authority';
import { YoutubeVideo } from '@/apis/music-request/musicRequest';
import { useDeleteMusicRequestMusic } from '@/hooks/apis/music-request/use-delete-music-request-music';
import { useToast } from '@/hooks/use-toast';

const layoutVariant = cva(
  'p-2 grid grid-cols-[1fr_auto] gap-2 cursor-pointer w-full',
  {
    variants: {
      isSelected: {
        true: 'bg-gray-100',
        false: 'bg-white',
      },
      isDeletePending: {
        true: 'animate-pulse bg-zinc-200',
      },
    },
  },
);

type Props = {
  video: YoutubeVideo;
  roomId: string;
  currentMusicId: string;
  updateCurrentVideoId: (musicId: string) => void;
};

export default function MusicCard({
  video,
  roomId,
  currentMusicId,
  updateCurrentVideoId,
}: Props) {
  const { toast } = useToast();

  const { mutate, isPending } = useDeleteMusicRequestMusic();

  const isSelectedMusic =
    currentMusicId !== null && currentMusicId === video.musicId;

  const handleDeleteMusic = async () => {
    // NOTE:(김홍동) 예시 페이지에서는 음악 삭제 기능 막기
    if (roomId === 'c15fa864-8719-41e9-99f4-4bcf64086d42') {
      toast({
        title: '이 페이지에서는 음악을 삭제할 수 없어요.',
        variant: 'default',
      });
    }

    if (isSelectedMusic) {
      toast({
        title: '재생 중인 곡은 삭제할 수 없어요.',
        variant: 'default',
      });
      return;
    }

    mutate({ roomId, musicId: video.musicId });
  };

  const handlePlayButton = () => {
    updateCurrentVideoId(video.musicId);
  };

  return (
    <div
      className={layoutVariant({
        isSelected: isSelectedMusic,
        isDeletePending: isPending,
      })}
    >
      <div
        className="grid grid-cols-[auto_1fr] gap-2"
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
          <span className="font-light text-gray-600 text-xs truncate">
            {video.student}의 신청곡
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-between ">
        <button type="button" onClick={() => handleDeleteMusic()}>
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
