import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { House } from 'lucide-react';
import { Button } from '@/components/button';
import { getRoomTitle } from '@/utils/api/firebaseAPI';
import {
  useMusicRequestTeacherAction,
  useMusicRequestTeacherState,
} from '../music-request-teacher-provider/music-request-teacher-provider.hooks';

const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MusicRequestTeacherMain() {
  const { roomId, roomTitle, params } = useMusicRequestTeacherState();
  const { settingRoomId, settingRoomTitle } = useMusicRequestTeacherAction();
  const router = useRouter();

  const settingRoomTitleCallback = useCallback(
    async (id: string) => {
      settingRoomTitle(await getRoomTitle(id));
    },
    [settingRoomTitle],
  );

  useEffect(() => {
    if (params?.roomId) {
      settingRoomId(params.roomId);
      settingRoomTitleCallback(params.roomId);
    }
  }, [params?.roomId, getRoomTitle, settingRoomId]);

  return (
    <div className="flex flex-col justify-center	items-center h-screen">
      <div className="flex flex-row">
        <button
          type="button"
          onClick={() => {
            router.push(`${originURL}/music-request/`);
          }}
        >
          <House />
        </button>
        방이름: {roomTitle}
      </div>
      <Button>
        <a href={`${originURL}/music-request/student/${roomId}`}>
          <p>학생방 입장</p>
          <p>{roomId}</p>
        </a>
      </Button>
    </div>
  );
}
