import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGetMusicRequestRooms } from '@/hooks/apis/music-request/use-get-music-request-room';
import { ChevronRight } from 'lucide-react';
import TeacherCanIcon from '@/assets/icons/TeacehrCanIcon';
import { cn } from '@/styles/utils';
import { Skeleton } from '@/components/skeleton';
import { Badge } from '@/components/badge';
import {
  getMusicRoomImage,
  getMusicRoomDescription,
  hasMusic,
} from './music-request-list.utils';

type Props = {
  roomIds: string[] | null;
};

export default function MusicRequestList({ roomIds }: Props) {
  const router = useRouter();
  const results = useGetMusicRequestRooms(roomIds);

  const rooms = results.map((result) => result.data);

  if (rooms.includes(undefined)) {
    return Array.from({ length: 3 }, (_, index) => (
      <Skeleton key={index} className="w-full aspect-video rounded-md" />
    ));
  }

  const reshapeRooms = rooms.map((room, index) => ({
    ...room,
    roomId: roomIds[index],
    headMusic: room.musicList[0],
  }));

  return reshapeRooms.map((room) => (
    <div
      key={room.roomId}
      className="cursor-pointer"
      onClick={() => {
        router.push(`/music-request/teacher/${room.roomId}`);
      }}
    >
      <div className="w-full aspect-video relative flex justify-center items-center">
        {hasMusic(room.musicList) ? (
          <Image
            className="object-cover rounded-md"
            src={getMusicRoomImage(room.musicList)}
            alt=""
            fill
          />
        ) : (
          <div className="z-10">
            <TeacherCanIcon width={100} height={100} />
          </div>
        )}
        {hasMusic(room.musicList) ? (
          <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-gray-900 to-transparent rounded-md" />
        ) : (
          <div className="absolute bottom-0 left-0 w-full h-full bg-gray-100 dark:bg-gray-900 rounded-md" />
        )}
        <div className="absolute bottom-0 left-0 w-full flex flex-col justify-end px-4 py-6 gap-2">
          <div
            className={cn(
              'font-medium text-gray-50 flex items-center',
              !hasMusic(room.musicList) && 'text-gray-900 dark:text-gray-50',
            )}
          >
            <span>{room.roomTitle}</span>
            <ChevronRight />
          </div>
          {hasMusic(room.musicList) && (
            <div
              className={cn(
                'text-sm text-gray-300 line-clamp-2',
                !hasMusic(room.musicList) && 'text-gray-900',
              )}
            >
              {getMusicRoomDescription(room.musicList)}
            </div>
          )}
        </div>
        {room.musicList.length > 0 && (
          <Badge className="absolute top-2 right-2">
            {room.musicList.length}곡
          </Badge>
        )}
      </div>
    </div>
  ));
}
