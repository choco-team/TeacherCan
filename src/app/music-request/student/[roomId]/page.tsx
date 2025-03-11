import MusicRequestStudentContainer from '@/containers/music-request/music-request-student/music-request-student-container';
import { MusicRequestStudentParams } from '@/containers/music-request/music-request-student/music-request-student-provider/music-request-student-provider';

export const metadata = {
  title: '음악신청',
};

function MusicRequestStudent({
  params,
}: {
  params: MusicRequestStudentParams;
}) {
  return <MusicRequestStudentContainer params={params} />;
}

export default MusicRequestStudent;
