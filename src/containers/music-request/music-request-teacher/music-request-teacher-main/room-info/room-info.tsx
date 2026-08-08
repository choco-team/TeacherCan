import { QRCodeCanvas } from 'qrcode.react';

type Props = {
  roomTitle: string;
  roomId: string;
};

export default function RoomInfo({ roomTitle, roomId }: Props) {
  return (
    <div className="flex flex-col gap-4 py-4 rounded">
      <div className="px-2 text-gray-700 dark:text-gray-200">
        방 이름: {roomTitle}
      </div>
      <div className="flex justify-center">
        <QRCodeCanvas
          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/music-request/student/${roomId}`}
          size={380}
        />
      </div>
    </div>
  );
}
