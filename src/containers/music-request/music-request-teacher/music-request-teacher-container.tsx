'use client';

import MusicRequestTeacherProvider, {
  MusicRequestTeacherParams,
} from './music-request-teacher-provider/music-request-teacher-provider';
import MusicRequestTeacherMain from './music-request-teacher-main/music-request-teacher-main';

export default function MusicRequestTeacherContainer({
  params,
}: {
  params: MusicRequestTeacherParams;
}) {
  return (
    <div>
      <MusicRequestTeacherProvider params={params}>
        <MusicRequestTeacherMain />
      </MusicRequestTeacherProvider>
    </div>
  );
}
