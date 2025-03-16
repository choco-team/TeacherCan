'use client';

import MusicRequestTeacherMain from './music-request-teacher-main/music-request-teacher-main';

export default function MusicRequestTeacherContainer({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  return <MusicRequestTeacherMain roomId={params.roomId} />;
}
