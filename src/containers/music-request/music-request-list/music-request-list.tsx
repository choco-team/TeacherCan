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
import DeleteRoomButton from './delete-room-button/delete-room-button';

type Props = {
  roomIds: string[];
  onRoomDeleted: (roomId: string) => void;
};

export default function MusicRequestList({ roomIds, onRoomDeleted }: Props) {
  const router = useRouter();
  const results = useGetMusicRequestRooms(roomIds);

  // 방마다 독립적으로 처리한다.
  // 하나를 묶어서 판단하면 조회에 실패한 방 때문에 목록 전체가 로딩 상태에 갇힌다.
  return results.map((result, index) => {
    const roomId = roomIds[index];

    if (result.isPending) {
      return (
        <Skeleton key={roomId} className="w-full aspect-video rounded-md" />
      );
    }

    // 삭제되었거나 잘못된 id 등으로 조회에 실패한 방은 목록에서 건너뛴다
    if (result.isError) {
      return null;
    }

    const room = result.data;

    return (
      <div
        key={roomId}
        className="cursor-pointer"
        onClick={() => {
          router.push(`/music-request/teacher/${roomId}`);
        }}
      >
        <div className="w-full aspect-video relative flex justify-center items-center">
          <DeleteRoomButton
            roomId={roomId}
            roomTitle={room.roomTitle}
            musicCount={room.musicList.length}
            onDeleted={onRoomDeleted}
          />
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
            <Badge className="absolute top-2 left-2">
              {room.musicList.length}곡
            </Badge>
          )}
        </div>
      </div>
    );
  });
}
