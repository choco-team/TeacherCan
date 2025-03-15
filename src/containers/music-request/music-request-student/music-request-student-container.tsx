'use client';

import MusicRequestStudentMain from './music-request-student-main/music-request-student-main';
import MusicRequestStudentProvider from './music-request-student-provider/music-request-student-provider';

export default function MusicRequestStudentContainer({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  return (
    <div>
      <MusicRequestStudentProvider>
        <MusicRequestStudentMain roomId={params.roomId} />
      </MusicRequestStudentProvider>
    </div>
  );
}
