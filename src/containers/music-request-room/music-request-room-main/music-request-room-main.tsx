'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  useMusicRequestRoomAction,
  useMusicRequestRoomState,
} from '../music-request-room-provider/music-request-room-provider.hooks';

export default function MusicRequestRoomMain() {
  const { roomID } = useMusicRequestRoomState();
  const { settingRoomID } = useMusicRequestRoomAction();
  const pathname = usePathname();

  useEffect(() => {
    settingRoomID(pathname.split('/').pop());
  }, [pathname]);

  return (
    <div className="flex justify-center	items-center h-screen">
      roomId: {roomID}
    </div>
  );
}
