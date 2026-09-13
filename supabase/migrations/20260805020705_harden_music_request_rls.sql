-- 음악신청 RLS 정리
--
-- create_room, delete_music 은 SECURITY DEFINER 로 RLS 를 우회한다.
-- 따라서 anon 에게 열려 있던 아래 INSERT 정책들은 실제로 아무도 쓰지 않는 통로다.
-- 열어두면 room_secrets 에 임의의 토큰을 심으려는 시도의 진입점이 되므로 닫는다.
-- (현재는 room_secrets.room_id 의 UNIQUE 제약이 우연히 막고 있을 뿐이다.)

ALTER POLICY rooms_insert ON public.rooms
  WITH CHECK (false);

ALTER POLICY room_secrets_insert ON public.room_secrets
  WITH CHECK (false);

-- rooms 만 UPDATE 정책이 없어 암묵적으로 거부되고 있었다.
-- 동작은 같지만 다른 테이블과 동일하게 의도를 명시한다.

DROP POLICY IF EXISTS rooms_update ON public.rooms;

CREATE POLICY rooms_update ON public.rooms
  FOR UPDATE
  USING (false);