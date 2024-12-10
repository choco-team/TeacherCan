import { Button } from '@/components/button';
import {
  useMusicRequestAction,
  useMusicRequestState,
} from '../music-request-provider/music-request-provider.hooks';

export default function MusicRequestMain() {
  const { roomID } = useMusicRequestState();
  const { settingRoomID } = useMusicRequestAction();

  const createRoom = async () => {
    const response = await fetch(
      `${window.location.origin}/api/firebase/music-request/room`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const json = await response.json();
    settingRoomID(json.roomID);
  };

  return (
    <div className="flex justify-center	items-center h-screen">
      <Button onClick={() => createRoom()}>방만들기</Button>
      roomId: {roomID}
    </div>
  );
}
