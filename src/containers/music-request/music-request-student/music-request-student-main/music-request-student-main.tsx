import { useCallback, useEffect } from 'react';

import { getRoomTitle } from '@/utils/api/firebaseAPI';
import {
  useMusicRequestStudentAction,
  useMusicRequestStudentState,
} from '../music-request-student-provider/music-request-student-provider.hooks';
import SearchPage from './search-page/search-page';
import CreateNamePage from './create-name-page/create-name-page';

export default function MusicRequestStudentMain() {
  const { settingRoomId, settingRoomTitle } = useMusicRequestStudentAction();
  const { studentName, roomTitle, params } = useMusicRequestStudentState();

  const settingRoomTitleCallback = useCallback(
    async (id: string) => {
      settingRoomTitle(await getRoomTitle(id));
    },
    [settingRoomTitle],
  );

  useEffect(() => {
    settingRoomId(params.roomId);
    settingRoomTitleCallback(params.roomId);
  }, [params.roomId, settingRoomId, settingRoomTitleCallback]);

  return (
    <div>
      <div className="flex flex-row justify-between	m-4">
        <div>방 이름: {roomTitle}</div>
        {studentName && <div>내 이름: {studentName}</div>}
      </div>
      {!studentName && <CreateNamePage />}
      {studentName && <SearchPage />}
    </div>
  );
}
