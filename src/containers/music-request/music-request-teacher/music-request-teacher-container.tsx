'use client';

import MusicRequestTeacherProvider from './music-request-teacher-provider/music-request-teacher-provider';
import MusicRequestTeacherMain from './music-request-teacher-main/music-request-teacher-main';

export default function MusicRequestTeacherContainer({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  return (
    <MusicRequestTeacherProvider>
      <MusicRequestTeacherMain roomId={params.roomId} />
    </MusicRequestTeacherProvider>
  );
}
