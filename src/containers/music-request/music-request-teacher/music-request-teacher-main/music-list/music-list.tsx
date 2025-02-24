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
    <div>
      {videos &&
        videos.map((video) => (
          <MusicCard video={video} roomId={params.roomId} key={video.videoId} />
        ))}
    </div>
  );
}
