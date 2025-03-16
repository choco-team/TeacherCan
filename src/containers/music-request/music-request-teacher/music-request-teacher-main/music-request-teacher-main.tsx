import { Tabs, TabsList, TabsTrigger } from '@/components/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { useGetMusicRequestRoom } from '@/hooks/apis/music-request/use-get-music-request-room';
import { useState } from 'react';
import MusicPlayer from './music-player/music-player';
import RoomInfo from './room-info/room-info';
import StudentList from './student-list/student-list';
import MusicList from './music-list/music-list';

type Props = {
  roomId: string;
};

export default function MusicRequestTeacherMain({ roomId }: Props) {
  const { data, isPending } = useGetMusicRequestRoom({ roomId });
  const [currentMusicIndex, setCurrentMusicIndex] = useState<number>(0);

  const updateCurrentVideoIndex = (index: number) => {
    setCurrentMusicIndex(index);
  };

  if (isPending) {
    // TODO:(김홍동) 로딩상태 구현하기
    return null;
  }

  const defaultTabMenu =
    data.studentList.length === 0 ? 'rome-info' : 'music-list';

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-0">
      <div className="flex flex-col w-full">
        <MusicPlayer
          currentVideoIndex={currentMusicIndex}
          updateCurrentVideoIndex={updateCurrentVideoIndex}
          musicList={data.musicList}
        />
      </div>
      <Tabs
        defaultValue={defaultTabMenu}
        className="flex flex-col w-full mb-[108px] lg:mb-0 lg:min-w-[400px] lg:max-w-[400px] pl-2 h-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="music-list">신청목록</TabsTrigger>
          <TabsTrigger value="student-list">학생목록</TabsTrigger>
          <TabsTrigger value="rome-info">방 정보</TabsTrigger>
        </TabsList>
        <TabsContent value="music-list">
          <MusicList
            videos={data.musicList}
            roomId={roomId}
            currentVideoIndex={currentMusicIndex}
            updateCurrentVideoIndex={updateCurrentVideoIndex}
          />
        </TabsContent>
        <TabsContent value="student-list">
          <StudentList students={data.studentList} />
        </TabsContent>
        <TabsContent value="rome-info">
          <RoomInfo roomId={roomId} roomTitle={data.roomTitle} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
