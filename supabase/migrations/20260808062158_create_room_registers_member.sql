-- 방을 만든 사람을 곧바로 소유자로 등록한다
--
-- create_room 이 room_members 까지 함께 기록하지 않으면, 방금 만든 방은
-- 클라이언트가 별도로 claim_room 을 호출하기 전까지 조회할 수 없다.
-- 방 생성 · 토큰 저장 · 소유권 등록을 한 트랜잭션으로 묶는다.
--
-- 세션이 없는 호출(구버전 클라이언트)에서는 auth.uid() 가 NULL 이므로 등록만 건너뛴다.
-- 기존 동작이 그대로 유지되므로 배포 전에 push 해도 안전하다.

CREATE OR REPLACE FUNCTION public.create_room (
  p_room_title   text,
  p_secret_token uuid
)
  RETURNS uuid
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
  DECLARE
    v_room_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO rooms (id, "roomTitle", "connectedAt")
    VALUES (v_room_id, p_room_title, now());

    INSERT INTO room_secrets (room_id, secret_token)
    VALUES (v_room_id, p_secret_token);

    -- 로그인한 교사라면 소유자로 등록한다. secret_token 은 영구 증명으로 그대로 남는다.
    IF auth.uid() IS NOT NULL THEN
      INSERT INTO room_members (user_id, room_id)
      VALUES (auth.uid(), v_room_id);
    END IF;

    RETURN v_room_id;
  END;
  $function$;
