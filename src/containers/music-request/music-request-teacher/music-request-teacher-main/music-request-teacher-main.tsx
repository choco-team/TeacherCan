import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { House } from 'lucide-react';
import { Button } from '@/components/button';
import {
  useMusicRequestTeacherAction,
  useMusicRequestTeacherState,
} from '../music-request-teacher-provider/music-request-teacher-provider.hooks';

const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MusicRequestTeacherMain() {
  const { roomId, roomTitle, params } = useMusicRequestTeacherState();
  const { settingRoomId, settingRoomTitle } = useMusicRequestTeacherAction();
  const router = useRouter();

  const getRoomTitle = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(
          `${originURL}/api/firebase/music-request/room?roomId=${id}`,
          {
            cache: 'force-cache',
          },
        );
        const json = await res.json();
        if (!res.ok) {
          throw new Error('응답이 존재하지 않습니다.');
        }
        settingRoomTitle(json.roomTitle);
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [settingRoomTitle],
  );

  useEffect(() => {
    if (params?.roomId) {
      settingRoomId(params.roomId);
      getRoomTitle(params.roomId);
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
