import { useEffect } from 'react';
import { getRoomTitle } from '@/utils/api/firebaseAPI';
import { Tabs, TabsList, TabsTrigger } from '@/components/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
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
    <div className="flex">
      <div className="flex flex-col w-full">
        <MusicPlayer />
      </div>
      <Tabs
        defaultValue="music-list"
        className="flex flex-col min-w-[400px] max-w-[400px] pl-2 h-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="music-list">신청목록</TabsTrigger>
          <TabsTrigger value="student-list">학생목록</TabsTrigger>
          <TabsTrigger value="rome-info">방 정보</TabsTrigger>
        </TabsList>
        <TabsContent value="music-list">
          <MusicList />
        </TabsContent>
        <TabsContent value="student-list">
          <StudentList />
        </TabsContent>
        <TabsContent value="rome-info">
          <RoomInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
}
