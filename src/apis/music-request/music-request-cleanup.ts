import { ensureMusicRoomSession } from '@/hooks/apis/music-request/use-music-room-session';
import { getMusicRooms } from './music-room-storage';
import { deleteMusicRequestRooms } from './musicRequest';

/**
 * 음악신청 데이터를 서버까지 정리한다.
 *
 * 로컬에는 방 소유 증명만 있고 실제 방과 신청곡은 서버에 있다. 교사에게는 그 구분이
 * 구현 세부사항이므로, 로컬 데이터를 지웠는데 본인은 볼 수도 없는 서버 데이터가
 * 남으면 "삭제했다"는 경험과 어긋난다.
 *
 * 호출하는 쪽에서 로컬 키를 지우기 전에 먼저 실행해야 한다. 순서가 반대면 서버 삭제가
 * 실패했을 때 방을 다시 찾을 수 없다.
 */
export const clearMusicRequestServerData = async () => {
  const roomIds = Object.keys(getMusicRooms());

  if (roomIds.length === 0) {
    return;
  }

  // 방 삭제는 room_members 소속 확인을 거치므로 세션이 필요하다
  await ensureMusicRoomSession();
  await deleteMusicRequestRooms(roomIds);
};
