'use client';

import MusicRequestProvider from './music-request-provider/music-request-provider';
import MusicRequestMain from './music-request-main/music-request-main';

export default function MusicRequestContainer() {
  return (
    <div>
      <MusicRequestProvider>
        <MusicRequestMain />
      </MusicRequestProvider>
    </div>
  );
}
