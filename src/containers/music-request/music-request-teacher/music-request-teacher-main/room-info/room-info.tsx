import { QRCodeCanvas } from 'qrcode.react';

const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Props = {
  roomTitle: string;
  roomId: string;
};

export default function RoomInfo({ roomTitle, roomId }: Props) {
  return (
    <div className="flex flex-col gap-4 py-4 rounded">
      <div className="px-2 text-gray-700">방 이름: {roomTitle}</div>
      <div className="flex justify-center">
        <QRCodeCanvas
          value={`${originURL}/music-request/student/${roomId}`}
          size={380}
        />
      </div>
    </div>
  );
}
