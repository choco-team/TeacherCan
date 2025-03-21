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
  return (
    <div className="flex flex-col gap-4 py-4 rounded">
      <div className="px-2 text-gray-700">방 이름: {roomTitle}</div>
      <div className="flex justify-center">
        <QRCodeCanvas
          value={`${originURL}/music-request/student/${roomId}`}
          size={380}
        />
      </div>
      <div className="w-hull h-[1px] bg-gray-100" />
      <Label className="flex items-center justify-between gap-x-2">
        <span className="pl-2">자동 업데이트</span>
        <Switch
          checked={isAutoRefetch}
          onClick={() => setIsAutoRefetch((prev) => !prev)}
        />
      </Label>
    </div>
  );
}
