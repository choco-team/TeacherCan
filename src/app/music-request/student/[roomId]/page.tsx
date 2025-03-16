import MusicRequestStudentContainer from '@/containers/music-request/music-request-student/music-request-student-container';

export const metadata = {
  title: '음악신청',
};

function MusicRequestStudent({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  return <MusicRequestStudentContainer params={params} />;
}

export default MusicRequestStudent;
