import { Tabs, TabsList, TabsTrigger } from '@/components/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { useCallback, useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { head } from 'lodash';
import MusicRegister from '@/containers/music-request/music-register/music-register';
import { useMusicSSE } from '@/hooks/apis/music-request/use-music-sse';
import { YoutubeVideo } from '@/apis/music-request/musicRequest';
import { useGetMusicRequestRoomTitle } from '@/hooks/apis/music-request/use-get-music-request-room-title';
import MusicPlayer from './music-player/music-player';
import RoomInfo from './room-info/room-info';
import MusicList from './music-list/music-list';

type Props = {
  roomId: string;
};

export default function MusicRequestTeacherMain({ roomId }: Props) {
  const [currentMusicId, setCurrentMusicId] = useState<string | null>(null);

  const { data, isPending } = useGetMusicRequestRoomTitle({ roomId });

  const [musicList, setMusicList] = useState<YoutubeVideo[]>([]);

  const handleMusicUpdate = useCallback((updatedList: YoutubeVideo[]) => {
    setMusicList([...updatedList]);
  }, []);

  useMusicSSE(roomId, handleMusicUpdate);

  const updateCurrentVideoId = (musicId: string) => {
    setCurrentMusicId(musicId);
  };

  useEffect(() => {
    if (currentMusicId) {
      return;
    }

    if (!musicList) {
      return;
    }

    if (musicList.length === 0) {
      return;
    }

    setCurrentMusicId(head(musicList).musicId);
  }, [currentMusicId, musicList]);

  if (isPending) {
    return (
      <LoaderCircle
        size="36px"
        className="animate-spin h-[600px] text-primary-500 mx-auto my-0"
      />
    );
  }

  const defaultTabMenu = musicList.length === 0 ? 'rome-info' : 'music-list';

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-0">
      <div className="flex flex-col w-full">
        <MusicPlayer
          currentMusicId={currentMusicId}
          updateCurrentVideoId={updateCurrentVideoId}
          musicList={musicList}
        />
      </div>
      <Tabs
        defaultValue={defaultTabMenu}
        className="flex flex-col w-full mb-[108px] lg:mb-0 lg:min-w-[400px] lg:max-w-[400px] lg:pl-2 h-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="music-list">신청목록</TabsTrigger>
          <TabsTrigger value="music-register">음악등록</TabsTrigger>
          <TabsTrigger value="rome-info">방 정보</TabsTrigger>
        </TabsList>
        <TabsContent value="music-list">
          <MusicList
            videos={musicList}
            roomId={roomId}
            currentMusicId={currentMusicId}
            updateCurrentVideoId={updateCurrentVideoId}
          />
        </TabsContent>
        <TabsContent value="music-register">
          <div className="p-2">
            <MusicRegister roomId={roomId} studentName="선생님" />
          </div>
        </TabsContent>
        <TabsContent value="rome-info">
          <RoomInfo roomId={roomId} roomTitle={data.roomTitle} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
