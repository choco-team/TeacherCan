'use client';

import MusicRequestStudentMain from './music-request-student-main/music-request-student-main';
import MusicRequestStudentProvider from './music-request-student-provider/music-request-student-provider';

export default function MusicRequestStudentContainer({
  params,
}: {
  params: MusicRequestStudentParams;
}) {
  return (
    <div>
      <MusicRequestStudentProvider params={params}>
        <MusicRequestStudentMain />
      </MusicRequestStudentProvider>
    </div>
  );
}
