-- 학생 경로를 RPC 로 분리
--
-- 학생 화면이 테이블을 직접 읽거나 쓰지 않도록 두 함수를 추가한다.
-- 두 함수 모두 roomId 를 인자로 받으므로 방 목록을 열거할 수 없다.
--
-- 이 마이그레이션은 순수 추가이며 기존 정책·권한을 바꾸지 않는다.
-- musics_insert 정책 차단은 클라이언트 배포 확인 후 별도 마이그레이션에서 진행한다.

-- 방 제목 조회 — 학생이 QR 로 받은 roomId 로 방 이름만 확인한다
CREATE OR REPLACE FUNCTION public.get_room_title(p_room_id uuid)
  RETURNS text
  LANGUAGE plpgsql
  SECURITY DEFINER
  STABLE
  SET search_path TO 'public'
AS $function$
DECLARE
  v_title text;
BEGIN
  SELECT "roomTitle" INTO v_title FROM rooms WHERE id = p_room_id;

  IF v_title IS NULL THEN
    RAISE EXCEPTION '방을 찾을 수 없어요. 링크를 다시 확인해주세요.';
  END IF;

  RETURN v_title;
END;
$function$;

-- 곡 신청 — 학생과 교사(선생님 이름으로 신청) 양쪽이 사용한다
--
-- musics 의 CHECK 제약을 위반하면 Postgres 원문 에러가 사용자에게 노출되므로
-- 여기서 미리 다듬고 검증해 안내 문구로 바꿔준다.
CREATE OR REPLACE FUNCTION public.add_music(
  p_room_id  uuid,
  p_music_id text,
  p_title    text,
  p_student  text
)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
DECLARE
  -- 한 방에 쌓일 수 있는 최대 곡 수 (도배 방어)
  c_max_music_count constant integer := 200;
  v_title   text;
  v_student text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM rooms WHERE id = p_room_id) THEN
    RAISE EXCEPTION '방을 찾을 수 없어요. 링크를 다시 확인해주세요.';
  END IF;

  IF p_music_id IS NULL OR p_music_id !~ '^[A-Za-z0-9_-]{11}$' THEN
    RAISE EXCEPTION '올바른 유튜브 영상이 아니에요.';
  END IF;

  -- 제목은 유튜브 API 조회 결과다. 비어 있으면 조회가 끝나기 전에 신청한 경우.
  v_title := left(btrim(coalesce(p_title, '')), 200);
  IF v_title = '' THEN
    RAISE EXCEPTION '곡 정보를 가져오지 못했어요. 잠시 후 다시 시도해주세요.';
  END IF;

  -- 자른 뒤 끝에 공백이 남을 수 있어 한 번 더 다듬는다 (musics_student_name_trimmed 대응)
  v_student := btrim(left(btrim(coalesce(p_student, '')), 20));
  IF v_student = '' THEN
    RAISE EXCEPTION '이름을 입력해 주세요.';
  END IF;

  IF (SELECT count(*) FROM musics WHERE "roomId" = p_room_id) >= c_max_music_count THEN
    RAISE EXCEPTION '이 방은 신청곡이 가득 찼어요. 선생님께 알려주세요.';
  END IF;

  -- timeStamp 는 컬럼 기본값(now())을 사용해 서버 시계로 기록한다
  INSERT INTO musics ("roomId", "musicId", title, "studentName")
  VALUES (p_room_id, p_music_id, v_title, v_student);
EXCEPTION
  -- musics_room_music_unique 위반. 클라이언트 사전 조회를 대체하며 경합도 함께 해소된다.
  WHEN unique_violation THEN
    RAISE EXCEPTION '이미 신청된 음악이에요.';
END;
$function$;

GRANT EXECUTE ON FUNCTION public.get_room_title(uuid) TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.add_music(uuid, text, text, text) TO anon, authenticated;
