import MusicRequestStudentContainer from '@/containers/music-request/music-request-student/music-request-student-container';
import { MusicRequestStudentParams } from '@/containers/music-request/music-request-student/music-request-student-provider/music-request-student-provider';

export const metadata = {
  title: 'Music Request Student',
};

function MusicRequestStudent({
  params,
}: {
  params: MusicRequestStudentParams;
}) {
  return <MusicRequestStudentContainer params={params} />;
}

export default MusicRequestStudent;
