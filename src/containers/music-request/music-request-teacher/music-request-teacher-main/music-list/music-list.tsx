import { useEffect } from 'react';
import { firebaseDB } from '@/services/firebase';
import { onValue, orderByChild, query, ref } from 'firebase/database';
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
    const dbRef = ref(firebaseDB, `musicRooms/${params.roomId}/musics`);
    const q = query(dbRef, orderByChild('timeStamp'));
    const unsubscribe = onValue(q, (snapshot) => {
      const value = snapshot.val();
      console.log(value);
      if (value) {
        const videoArray = Object.keys(value).map((key) => ({
          ...value[key],
          videoId: key,
          playCount: 0,
        }));
        videoArray.sort((a, b) => a.timeStamp - b.timeStamp);
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
