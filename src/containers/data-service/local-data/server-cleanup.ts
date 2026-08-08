import { clearMusicRequestServerData } from '@/apis/music-request/music-request-cleanup';

/**
 * 로컬 키를 지우기 전에 함께 정리해야 하는 서버 데이터.
 *
 * 로컬 데이터 관리 페이지는 브라우저 저장소를 지우는 곳이지만, 기능에 따라 실제
 * 데이터가 서버에 있는 경우가 있다. 사용자에게는 그 구분이 구현 세부사항이므로
 * "삭제"가 반쪽만 이뤄지지 않도록 여기서 이어준다.
 *
 * ── 새 기능을 추가할 때 ──
 * 정리 함수는 각 기능 쪽(예: apis/<기능>/...)에 두고 여기서는 연결만 한다.
 * 컨테이너가 모든 기능의 내부를 직접 import 하면 데이터 관리 페이지가 전체 기능에
 * 의존하게 되고, 여러 개발자가 같은 파일을 고치게 된다.
 *
 * 기능이 별도 Supabase 프로젝트를 쓰더라도(투표 등) 각자의 정리 함수 안에서
 * 자기 클라이언트를 쓰면 되므로 이 파일은 그대로 둘 수 있다.
 */
const SERVER_CLEANUP_BY_KEY: Record<string, () => Promise<void>> = {
  'music-rooms': clearMusicRequestServerData,
};

/** 해당 키에 서버 정리가 필요하면 실행한다. 없으면 아무 일도 하지 않는다. */
export const runServerCleanup = (key: string) =>
  SERVER_CLEANUP_BY_KEY[key]?.() ?? Promise.resolve();
