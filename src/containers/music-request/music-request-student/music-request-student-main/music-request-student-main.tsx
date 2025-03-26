import { useGetMusicRequestRoomTitle } from '@/hooks/apis/music-request/use-get-music-request-room-title';
import { useMusicRequestStudentState } from '../music-request-student-provider/music-request-student-provider.hooks';
import SearchPage from './search-page/search-page';
import CreateNamePage from './create-name-page/create-name-page';

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
      <div className="flex flex-col gap-2 text-sm text-gray-700">
        <span>방 이름: {data?.roomTitle}</span>
        {studentName && <span>내 이름: {studentName}</span>}
      </div>
      {!studentName && roomId ? <CreateNamePage roomId={roomId} /> : null}
      {studentName && <SearchPage roomId={roomId} />}
    </div>
  );
}
