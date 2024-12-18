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
import MusicCard from './music-card/music-card';

const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function MusicRequestTeacherMain() {
  const { roomId, roomTitle, params } = useMusicRequestTeacherState();
  const { settingRoomId, settingRoomTitle } = useMusicRequestTeacherAction();
  const router = useRouter();
  const { videos } = useMusicRequestTeacherState();
  const { settingVideos } = useMusicRequestTeacherAction();
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
        settingVideos(videoArray);
      } else {
        settingVideos([]);
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
      } else {
        setStudents([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-6 h-screen">
      <div className="flex flex-col col-span-4">
        <div className="h-36 p-4 border-solid border-2 ">음악 플레이어</div>
        <div className="border-solid border-2 ">
          {videos &&
            videos.map((video) => (
              <MusicCard video={video} roomId={roomId} key={video.videoId} />
            ))}
        </div>
      </div>
      <div className="flex flex-col col-span-2">
        <div className="border-solid border-2 ">
          <div className="flex flex-row bg-primary-200 rounded p-2 m-2">
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
        </div>

        <div className="p-2 border-solid border-2">
          <Button>
            <a href={`${originURL}/music-request/student/${roomId}`}>
              <p>학생방 큐알 넣기</p>
              <p>{roomId}</p>
            </a>
          </Button>
        </div>
        <div className="border-solid border-2">
          <div className="bg-primary-200 rounded m-2 p-2">
            {students &&
              students.map((student) => <div key={nanoid()}>{student}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
