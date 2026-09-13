-- 방의 마지막 활동 시각을 컬럼으로 관리
--
-- 오래 방치된 방을 골라내려면 "언제까지 쓰였는지"가 필요하다.
-- 곡의 timeStamp 로 계산할 수도 있지만 두 가지를 놓친다.
--   1) 곡 삭제 — 곡이 사라지면 그 흔적도 사라진다
--   2) 재생만 하는 사용 — 교사가 플레이리스트를 한 번 만들어두고 수업마다 재생만
--      하는 경우, 곡 추가·삭제가 없어 활동으로 잡히지 않는다. 실제로는 가장
--      활발히 쓰이는 방인데 정리 대상으로 오인될 수 있다.
--
-- 갱신 시점은 셋이다.
--   방 생성       → 컬럼 기본값
--   곡 추가·삭제  → musics 트리거
--   상세 페이지 진입 → touch_room RPC (Postgres 에 SELECT 트리거가 없어 명시 호출)
--
-- 목록 조회는 갱신하지 않는다. 목록은 모든 방을 한꺼번에 읽으므로 갱신하면
-- 방치된 방까지 전부 최신으로 만들어 버린다.
--
-- 허용·추가 방향이라 구버전 클라이언트에 영향이 없다.

-- ─────────────────────────────────────────────
-- 컬럼
-- ─────────────────────────────────────────────

ALTER TABLE public.rooms
  ADD COLUMN "lastActivityAt" timestamp with time zone NOT NULL DEFAULT now();

-- 기존 행은 마지막 곡의 시각으로, 곡이 없으면 방 생성 시각으로 채운다
UPDATE public.rooms r
SET "lastActivityAt" = COALESCE(
  (SELECT max("timeStamp") FROM musics WHERE "roomId" = r.id),
  r."connectedAt"
);

-- 정리 대상 조회는 이 컬럼 기준으로 정렬·필터링한다
CREATE INDEX rooms_last_activity_at_idx ON public.rooms ("lastActivityAt");

-- ─────────────────────────────────────────────
-- 곡 추가·삭제 시 갱신
-- ─────────────────────────────────────────────

-- rooms_update 정책이 USING (false) 이므로 SECURITY DEFINER 가 필수다.
-- 일반 역할로 실행되면 트리거의 UPDATE 가 차단되어 곡 신청 자체가 롤백된다.
CREATE OR REPLACE FUNCTION public.touch_room_last_activity()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE rooms
  SET "lastActivityAt" = now()
  WHERE id = COALESCE(NEW."roomId", OLD."roomId");

  RETURN NULL;
END;
$function$;

CREATE TRIGGER musics_touch_room_last_activity
  AFTER INSERT OR DELETE ON public.musics
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_room_last_activity();

-- ─────────────────────────────────────────────
-- 상세 페이지 진입 시 갱신
-- ─────────────────────────────────────────────

-- 부수 효과라 실패해도 화면 흐름을 막지 않는다. 소속이 아니면 조용히 넘어간다.
CREATE OR REPLACE FUNCTION public.touch_room(p_room_id uuid)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT is_room_member(p_room_id) THEN
    RETURN;
  END IF;

  UPDATE rooms
  SET "lastActivityAt" = now()
  WHERE id = p_room_id;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.touch_room(uuid) TO authenticated;
