import { House } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import { useMusicRequestTeacherState } from '../../music-request-teacher-provider/music-request-teacher-provider.hooks';

const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RoomInfo() {
  const { roomId, roomTitle } = useMusicRequestTeacherState();

  const router = useRouter();

  return (
    <div className="flex flex-col bg-primary-200 p-2 m-2 rounded">
      <div className="flex flex-row mb-2 justify-center">
        <button
          className="mr-2"
          type="button"
          onClick={() => {
            router.push(`${originURL}/music-request/`);
          }}
        >
          <House />
        </button>
        방이름: {roomTitle}
      </div>
      <div className="flex justify-center">
        <a href={`${originURL}/music-request/student/${roomId}`}>
          <QRCodeCanvas
            value={`${originURL}/music-request/student/${roomId}`}
            size={150}
          />
        </a>
      </div>
    </div>
  );
}
