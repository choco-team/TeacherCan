import MusicRequestTeacherContainer from '@/containers/music-request/music-request-teacher/music-request-teacher-container';

export const metadata = {
  title: '음악신청',
};

function MusicRequestTeacher({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  return <MusicRequestTeacherContainer params={params} />;
}

export default MusicRequestTeacher;
