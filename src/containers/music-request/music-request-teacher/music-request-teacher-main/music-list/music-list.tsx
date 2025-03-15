import { useEffect } from 'react';
import { firebaseDB } from '@/services/firebase';
import { onValue, ref } from 'firebase/database';
import {
  useMusicRequestTeacherAction,
  useMusicRequestTeacherState,
} from '../../music-request-teacher-provider/music-request-teacher-provider.hooks';
import MusicCard from './music-card/music-card';

export default function MusicList() {
  const { params, videos } = useMusicRequestTeacherState();
  const { settingVideos, settingNumberOfVideos } =
    useMusicRequestTeacherAction();

  useEffect(() => {
    const dbRef = ref(firebaseDB, `musicRooms/${params.roomId}/musics/list`);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        const videoArray = Object.keys(value).map((key) => ({
          ...value[key],
          musicId: key,
          playCount: 0,
        }));
        settingVideos(videoArray);
        settingNumberOfVideos(videoArray.length);
      } else {
        settingVideos([]);
        settingNumberOfVideos(0);
      }
    });
    return () => unsubscribe();
  }, [params.roomId, settingVideos, settingNumberOfVideos]);

  return (
    <div className="h-[calc(100vh-200px)] overflow-scroll py-4">
      {videos ? (
        <div className="flex flex-col gap-[1px] bg-gray-200">
          {videos.map((video, index) => (
            <MusicCard
              video={video}
              roomId={params.roomId}
              key={video.videoId}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-12 justify-center items-center">
          <div className="text-center text-sm text-gray-500">
            <span>신청된 음악이 없어요.</span>
            <br />
            <span>방 정보에서 QR코드를 통해 학생을 초대해보세요.</span>
          </div>
        </div>
      )}
    </div>
  );
}
