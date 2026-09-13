-- 음악신청 조회 범위를 소유한 방으로 제한
--
-- 지금까지 rooms/musics 의 SELECT 정책이 USING (true) 였다.
-- anon 키는 브라우저 번들에 공개되어 있으므로, 누구나 REST 로 모든 교실의
-- 신청곡과 학생 이름을 조회할 수 있는 상태였다.
--
-- 교사 익명 로그인과 room_members 등록이 배포되어 이제 소속으로 판단할 수 있다.
--
-- ⚠️ 이 마이그레이션은 거부 방향이다. 구버전 클라이언트(anon 으로 테이블을 읽던)가
--    남아 있으면 교사 화면이 즉시 동작하지 않는다. 반드시 배포 완료를 확인한 뒤 push 할 것.
--
-- 되돌리려면:
--   ALTER POLICY rooms_select  ON public.rooms  USING (true);
--   ALTER POLICY musics_select ON public.musics USING (true);
--   GRANT ALL ON public.rooms, public.musics TO anon, authenticated;

-- ─────────────────────────────────────────────
-- 조회 정책
-- ─────────────────────────────────────────────

-- is_room_member 는 SECURITY DEFINER + STABLE 이라 room_members 의 RLS 를 우회하고
-- 행마다 재실행되지 않는다. musics 는 곡 수만큼 평가되므로 이 점이 중요하다.

ALTER POLICY rooms_select ON public.rooms
  USING (is_room_member(id));

ALTER POLICY musics_select ON public.musics
  USING (is_room_member("roomId"));

-- ─────────────────────────────────────────────
-- 테이블 권한 정리
-- ─────────────────────────────────────────────

-- 학생은 테이블에 접근하지 않는다. get_room_title, add_music 두 RPC 만 사용하며
-- 둘 다 SECURITY DEFINER 라 호출자의 테이블 권한이 필요 없다.
-- 권한 자체를 회수하면 정책을 잘못 건드려도 뚫리지 않는다.
REVOKE ALL ON public.rooms         FROM anon;
REVOKE ALL ON public.musics        FROM anon;
REVOKE ALL ON public.room_secrets  FROM anon;

-- 교사가 실제로 필요한 것만 남긴다.
--   rooms  : 조회(SELECT) + 방 삭제(DELETE). 방 삭제는 rooms_delete 정책이 판단한다.
--   musics : 조회(SELECT). realtime 구독도 이 정책으로 평가된다.
-- 방 생성과 곡 추가·삭제는 RPC(create_room, add_music, delete_music)를 거치므로
-- 해당 테이블에 대한 쓰기 권한은 필요 없다.
REVOKE ALL ON public.rooms         FROM authenticated;
REVOKE ALL ON public.musics        FROM authenticated;
REVOKE ALL ON public.room_secrets  FROM authenticated;

GRANT SELECT, DELETE ON public.rooms  TO authenticated;
GRANT SELECT          ON public.musics TO authenticated;
