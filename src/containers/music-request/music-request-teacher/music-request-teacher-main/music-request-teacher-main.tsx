import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { House } from 'lucide-react';
import { Button } from '@/components/button';
import { getRoomTitle } from '@/utils/api/firebaseAPI';
import { onValue, ref } from 'firebase/database';
import { firebaseDB } from '@/services/firebase';
import { nanoid } from 'nanoid';
import {
  useMusicRequestTeacherAction,
  useMusicRequestTeacherState,
} from '../music-request-teacher-provider/music-request-teacher-provider.hooks';

const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MusicRequestTeacherMain() {
  const { roomId, roomTitle, params } = useMusicRequestTeacherState();
  const { settingRoomId, settingRoomTitle } = useMusicRequestTeacherAction();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [students, setStudents] = useState([]);

  const settingRoomTitleCallback = useCallback(
    async (id: string) => {
      settingRoomTitle(await getRoomTitle(id));
    },
    [settingRoomTitle],
  );

  useEffect(() => {
    if (params?.roomId) {
      settingRoomId(params.roomId);
      settingRoomTitleCallback(params.roomId);
    }
  }, [params?.roomId, settingRoomId, settingRoomTitleCallback]);

  useEffect(() => {
    const dbRef = ref(firebaseDB, `musicRooms/${params.roomId}/musics`);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        const videoArray = Object.keys(value).map((key) => ({
          id: key,
          ...value[key],
        }));
        setVideos(videoArray);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const dbRef = ref(firebaseDB, `musicRooms/${params.roomId}/students`);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        const studentArray = Object.keys(value);
        setStudents(studentArray);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-6 h-screen">
      <div className="flex flex-col col-span-4">
        <div className="h-36 bg-zinc-500">음악 플레이어</div>
        <div className="bg-red-100">
          신청목록
          {videos &&
            videos.map((video) => (
              <div key={video.id}>
                <p>{video.title}</p>
                <p>{video.proposer}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col col-span-2">
        <div className="flex flex-row bg-orange-300">
          <button
            type="button"
            onClick={() => {
              router.push(`${originURL}/music-request/`);
            }}
          >
            <House />
          </button>
          방이름: {roomTitle}
        </div>
        <div className="bg-amber-200">
          <Button>
            <a href={`${originURL}/music-request/student/${roomId}`}>
              <p>학생방 큐알 넣기</p>
              <p>{roomId}</p>
            </a>
          </Button>
        </div>
        <div className="bg-lime-500">
          학생 목록
          <div className="bg-white m-2">
            {students &&
              students.map((student) => <div key={nanoid()}>{student}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
