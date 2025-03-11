import MusicRequestTeacherContainer from '@/containers/music-request/music-request-teacher/music-request-teacher-container';
import { MusicRequestTeacherParams } from '@/containers/music-request/music-request-teacher/music-request-teacher-provider/music-request-teacher-provider';

export const metadata = {
  title: '음악신청',
};

function MusicRequestTeacher({
  params,
}: {
  params: MusicRequestTeacherParams;
}) {
  return <MusicRequestTeacherContainer params={params} />;
}

export default MusicRequestTeacher;
