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
  const { settingVideos } = useMusicRequestTeacherAction();

  useEffect(() => {
    const dbRef = ref(firebaseDB, `musicRooms/${params.roomId}/musics`);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        const videoArray = Object.keys(value).map((key) => ({
          videoId: key,
          ...value[key],
        }));
        settingVideos(videoArray);
      } else {
        settingVideos([]);
      }
    });
    return () => unsubscribe();
  }, [params.roomId, settingVideos]);

  return (
    <div>
      {videos &&
        videos.map((video) => (
          <MusicCard video={video} roomId={params.roomId} key={video.videoId} />
        ))}
    </div>
  );
}
