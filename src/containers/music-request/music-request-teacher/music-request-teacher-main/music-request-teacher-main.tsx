import { Tabs, TabsList, TabsTrigger } from '@/components/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { useGetMusicRequestRoom } from '@/hooks/apis/music-request/use-get-music-request-room';
import { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { head } from 'lodash';
import MusicPlayer from './music-player/music-player';
import RoomInfo from './room-info/room-info';
import StudentList from './student-list/student-list';
import MusicList from './music-list/music-list';
import { MusicRefresh } from './music-refresh/music-refresh';

type Props = {
  roomId: string;
};

export default function MusicRequestTeacherMain({ roomId }: Props) {
  const { data, isPending, refetch, isRefetching } = useGetMusicRequestRoom({
    roomId,
  });
  const [currentMusicId, setCurrentMusicId] = useState<string | null>(null);

  const [isAutoRefetch, setIsAutoRefetch] = useState(false);

  const updateCurrentVideoId = (musicId: string) => {
    setCurrentMusicId(musicId);
  };

  useEffect(() => {
    if (currentMusicId) {
      return;
    }

    if (!data) {
      return;
    }

    if (data.musicList.length === 0) {
      return;
    }

    setCurrentMusicId(head(data.musicList).musicId);
  }, [data]);

  if (isPending) {
    return (
      <LoaderCircle
        size="36px"
        className="animate-spin h-[600px] text-primary-500 mx-auto my-0"
      />
    );
  }

  const defaultTabMenu =
    data.studentList.length === 0 ? 'rome-info' : 'music-list';

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-0">
      <div className="flex flex-col w-full">
        <MusicPlayer
          currentMusicId={currentMusicId}
          updateCurrentVideoId={updateCurrentVideoId}
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
            currentMusicId={currentMusicId}
            updateCurrentVideoId={updateCurrentVideoId}
          />
        </TabsContent>
        <TabsContent value="student-list">
          <StudentList students={data.studentList} />
        </TabsContent>
        <TabsContent value="rome-info">
          <RoomInfo
            roomId={roomId}
            roomTitle={data.roomTitle}
            isAutoRefetch={isAutoRefetch}
            setIsAutoRefetch={setIsAutoRefetch}
          />
        </TabsContent>
      </Tabs>
      <MusicRefresh
        musicRefetch={refetch}
        isAutoRefetch={isAutoRefetch}
        isRefetching={isRefetching}
      />
    </div>
  );
}
