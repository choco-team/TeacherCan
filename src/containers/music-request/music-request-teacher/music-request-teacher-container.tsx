'use client';

import { useMusicRooms } from '@/apis/music-request/music-room-storage';
import { useMusicRoomSession } from '@/hooks/apis/music-request/use-music-room-session';
import LoadingSpinner from '@/components/loading-spinner';
import MusicRequestTeacherMain from './music-request-teacher-main/music-request-teacher-main';

type Props = {
  params: {
    roomId: string;
  };
};

function TeacherMessage({ title, description }: Record<string, string>) {
  return (
    <div className="flex flex-col gap-2 py-12 text-center">
      <h3 className="text-lg font-medium text-text-title">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

export default function MusicRequestTeacherContainer({ params }: Props) {
  const { roomIds, isLoaded } = useMusicRooms();

  // 이 기기에서 만든 방만 조회할 수 있다. 남의 방이면 세션을 만들 이유도 없다.
  const isOwnedRoom = roomIds.includes(params.roomId);

  const { isReady, isError } = useMusicRoomSession({
    enabled: isLoaded && isOwnedRoom,
  });

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  if (!isOwnedRoom) {
    return (
      <TeacherMessage
        title="이 기기에서 만든 방이 아니에요"
        description="방을 만든 기기에서 열어주세요. 방이 삭제되었을 수도 있어요."
      />
    );
  }

  if (isError) {
    return (
      <TeacherMessage
        title="방 정보를 불러오지 못했어요"
        description="잠시 후 페이지를 새로고침해주세요."
      />
    );
  }

  // 소유권 등록이 끝나기 전에 구독을 걸면 실시간 이벤트를 받지 못한다
  if (!isReady) {
    return <LoadingSpinner />;
  }

  return <MusicRequestTeacherMain roomId={params.roomId} />;
}
