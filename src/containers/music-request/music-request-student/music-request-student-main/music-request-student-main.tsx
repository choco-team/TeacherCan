import { useGetMusicRequestRoomTitle } from '@/hooks/apis/music-request/use-get-music-request-room-title';
import TeacherCanIcon from '@/assets/icons/TeacehrCanIcon';
import { useMusicRequestStudentState } from '../music-request-student-provider/music-request-student-provider.hooks';
import CreateNamePage from './create-name-page/create-name-page';
import RegisterMusic from './register-music/register-music';

type Props = {
  roomId: string;
};

export default function MusicRequestStudentMain({ roomId }: Props) {
  const { studentName } = useMusicRequestStudentState();

  const { data, isPending } = useGetMusicRequestRoomTitle({ roomId });

  if (isPending) {
    // TODO:(김홍동) pending 상태 작업하기
    return null;
  }

  return (
    <div className="flex flex-col gap-4 lg:max-w-[600px] lg:my-0 lg:mx-auto">
      <div className="flex gap-2 items-center text-lg">
        <TeacherCanIcon width={20} />
        <span className="text-text-title">티처캔 음악 신청</span>
      </div>
      <div className="flex flex-col gap-2 text-sm text-text-title">
        <span>방 이름: {data?.roomTitle}</span>
        {studentName && <span>내 이름: {studentName}</span>}
      </div>
      {!studentName && roomId ? <CreateNamePage roomId={roomId} /> : null}
      {/* NOTE:(김홍동) 유튜브 API 검색 시 사용되는 토큰값이 많아 search page는 미노출합니다. */}
      {/* {studentName && <SearchPage roomId={roomId} />} */}
      {studentName && <RegisterMusic roomId={roomId} />}
    </div>
  );
}
