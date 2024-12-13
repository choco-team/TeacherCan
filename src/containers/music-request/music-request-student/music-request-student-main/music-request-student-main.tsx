'use client';

import { useCallback, useEffect } from 'react';

import {
  useMusicRequestStudentAction,
  useMusicRequestStudentState,
} from '../music-request-student-provider/music-request-student-provider.hooks';
import SearchPage from './search-page/search-page';
import CreateNamePage from './create-name-page/create-name-page';

const originURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MusicRequestStudentMain() {
  const { settingRoomId, settingRoomTitle } = useMusicRequestStudentAction();
  const { studentName, roomTitle, params } = useMusicRequestStudentState();

  const getRoomTitle = useCallback(
    async (roomId: string) => {
      try {
        const res = await fetch(
          `${originURL}/api/firebase/music-request/room?roomId=${roomId}`,
          {
            cache: 'force-cache',
          },
        );
        const json = await res.json();
        if (!res.ok) {
          throw new Error('응답이 존재하지 않습니다.');
        }
        settingRoomTitle(json.roomTitle);
      } catch (e) {
        throw new Error(e.message);
      }
    },
    [settingRoomTitle],
  );

  useEffect(() => {
    settingRoomId(params.roomId);
    getRoomTitle(params.roomId);
  }, [params.roomId, getRoomTitle, settingRoomId]);

  return (
    <div>
      <p>방 이름: {roomTitle}</p>
      {studentName && <p>내 이름: {studentName}</p>}
      {!studentName && <CreateNamePage />}
      {studentName && <SearchPage />}
    </div>
  );
}
