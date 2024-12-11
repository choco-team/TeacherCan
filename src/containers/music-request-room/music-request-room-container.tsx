'use client';

import MusicRequestRoomMain from './music-request-room-main/music-request-room-main';
import MusicRequestRoomProvider from './music-request-room-provider/music-request-room-provider';

export default function MusicRequestRoomContainer() {
  return (
    <div>
      <MusicRequestRoomProvider>
        <MusicRequestRoomMain />
      </MusicRequestRoomProvider>
    </div>
  );
}
