import { useEffect } from 'react';
import { getRoomTitle } from '@/utils/api/firebaseAPI';
import {
  useMusicRequestTeacherAction,
  useMusicRequestTeacherState,
} from '../music-request-teacher-provider/music-request-teacher-provider.hooks';
import MusicPlayer from './music-player/music-player';
import RoomInfo from './room-info/room-info';
import StudentList from './student-list/student-list';
import MusicList from './music-list/music-list';

export default function MusicRequestTeacherMain() {
  const { params } = useMusicRequestTeacherState();
  const { settingRoomId, settingRoomTitle } = useMusicRequestTeacherAction();

  useEffect(() => {
    if (params?.roomId) {
      settingRoomId(params.roomId);
      getRoomTitle(params.roomId).then((title) => {
        settingRoomTitle(title);
      });
    }
  }, [params?.roomId, settingRoomId, settingRoomTitle]);

  return (
    <div className="grid grid-cols-3">
      <div className="flex flex-col col-span-2">
        <MusicPlayer />
      </div>
      <div className="flex flex-col col-span-1">
        <RoomInfo />
        <StudentList />
        <MusicList />
      </div>
    </div>
  );
}
