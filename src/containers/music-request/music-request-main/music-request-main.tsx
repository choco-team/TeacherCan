import { Button } from '@/components/button';
import { useState } from 'react';
import {
  useMusicRequestAction,
  useMusicRequestState,
} from '../music-request-provider/music-request-provider.hooks';

export default function MusicRequestMain() {
  const [isLoading, setIsLoading] = useState<boolean | null>(false);
  const { roomId } = useMusicRequestState();
  const { settingRoomId } = useMusicRequestAction();
  const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const createRoom = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${originURL}/api/firebase/music-request/room`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await response.json();
      settingRoomId(json.roomId);
    } catch (error) {
      throw Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center	items-center h-screen">
      <Button onClick={() => createRoom()}>
        {isLoading ? '로딩중..' : '방만들기'}
      </Button>
      <br />
      {roomId && (
        <Button>
          <a href={`${originURL}/music-request/${roomId}`}>
            학생방입장 <br />
            {roomId}
          </a>
        </Button>
      )}
    </div>
  );
}
