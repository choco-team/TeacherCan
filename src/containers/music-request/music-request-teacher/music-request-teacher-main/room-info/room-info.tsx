import { Label } from '@/components/label';
import { Switch } from '@/components/switch';
import { QRCodeCanvas } from 'qrcode.react';
import { Dispatch, SetStateAction } from 'react';

const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Props = {
  roomTitle: string;
  roomId: string;
  isAutoRefetch: boolean;
  setIsAutoRefetch: Dispatch<SetStateAction<boolean>>;
};

export default function RoomInfo({
  roomTitle,
  roomId,
  isAutoRefetch,
  setIsAutoRefetch,
}: Props) {
  // NOTE:(김홍동) 예시 페이지에서는 학생 초대 막기
  if (roomId === 'c15fa864-8719-41e9-99f4-4bcf64086d42') {
    return (
      <div className="flex flex-col gap-4 mt-12 justify-center items-center">
        <div className="text-center text-sm text-gray-500">
          <span>선생님들께 예시로 보여드리는 음악 신청 페이지예요.</span>
          <br />
          <span>
            직접 방을 만들어 학생들을 초대해보시면 신청 기능을 더 자세히
            체험해보실 수 있어요.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 rounded">
      <div className="px-2 text-gray-700 dark:text-gray-200">
        방 이름: {roomTitle}
      </div>
      <div className="flex justify-center">
        <QRCodeCanvas
          value={`${originURL}/music-request/student/${roomId}`}
          size={380}
        />
      </div>
      <div className="w-hull h-[1px] bg-gray-100 dark:bg-gray-800" />
      <Label className="flex items-center justify-between gap-x-2">
        <span className="pl-2 text-text-title">자동 업데이트</span>
        <Switch
          checked={isAutoRefetch}
          onClick={() => setIsAutoRefetch((prev) => !prev)}
        />
      </Label>
    </div>
  );
}
