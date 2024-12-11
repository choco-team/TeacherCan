'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  useMusicRequestRoomAction,
  useMusicRequestRoomState,
} from '../music-request-room-provider/music-request-room-provider.hooks';

export default function MusicRequestRoomMain() {
  const { roomId } = useMusicRequestRoomState();
  const { settingRoomId } = useMusicRequestRoomAction();
  const pathname = usePathname();

  useEffect(() => {
    settingRoomId(pathname.split('/').pop());
  }, [pathname]);

  return (
    <div className="flex justify-center	items-center h-screen">
      roomId: {roomId}
    </div>
  );
}
