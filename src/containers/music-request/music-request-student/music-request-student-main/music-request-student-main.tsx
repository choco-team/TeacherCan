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

  const { data, isPending, isError } = useGetMusicRequestRoomTitle({ roomId });

  if (isPending) {
    // TODO:(김홍동) pending 상태 작업하기
    return null;
  }

  // 방 조회에 실패하면 이름 입력·곡 신청 단계로 넘어가지 않도록 여기서 멈춘다
  if (isError) {
    return (
      <div className="flex flex-col gap-4 lg:max-w-[600px] lg:my-0 lg:mx-auto">
        <div className="flex gap-2 items-center text-lg">
          <TeacherCanIcon width={20} />
          <span className="text-text-title">티처캔 음악 신청</span>
        </div>
        <div className="flex flex-col gap-2 py-12 text-center">
          <h3 className="text-lg font-medium text-text-title">
            방을 찾을 수 없어요
          </h3>
          <p className="text-sm text-gray-500">
            선생님께 받은 링크나 QR 코드를 다시 확인해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:max-w-[600px] lg:my-0 lg:mx-auto">
      <div className="flex gap-2 items-center text-lg">
        <TeacherCanIcon width={20} />
        <span className="text-text-title">티처캔 음악 신청</span>
      </div>
      <div className="flex flex-col gap-2 text-sm text-text-title">
        <span>방 이름: {data.roomTitle}</span>
        {/* {studentName && <span>내 이름: {studentName}</span>} */}
      </div>
      <CreateNamePage roomId={roomId} />
      {studentName && <RegisterMusic roomId={roomId} />}
    </div>
  );
}
