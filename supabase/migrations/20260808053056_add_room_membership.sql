-- 교사 방 소유권을 서버에 등록하기 위한 기반
--
-- 지금까지 방 소유권은 브라우저 localStorage 의 secret_token 뿐이었다.
-- RLS 는 그 값을 볼 수 없어서 조회 범위를 방 단위로 좁힐 수 없었다.
--
-- 교사가 익명 로그인 후 secret_token 으로 소유권을 주장하면(claim_room)
-- room_members 에 기록되고, 이후 정책이 auth.uid() 로 판단할 수 있게 된다.
-- secret_token 은 영구 소유권 증명으로 그대로 남는다. 익명 세션을 잃어도
-- 다시 로그인해 claim_room 을 호출하면 복구된다.
--
-- 이 마이그레이션은 추가와 허용만 한다. 구버전 클라이언트에 영향이 없으므로
-- 배포 전에 push 해도 안전하다. 조회 범위 제한은 배포 확인 후 별도 마이그레이션에서 한다.

-- ─────────────────────────────────────────────
-- room_members
-- ─────────────────────────────────────────────

CREATE TABLE public.room_members (
  user_id    uuid                     NOT NULL,
  room_id    uuid                     NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, room_id)
);

-- 익명 계정을 정리하면 소속도 함께 사라진다
ALTER TABLE public.room_members
  ADD CONSTRAINT room_members_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.room_members
  ADD CONSTRAINT room_members_room_id_fkey
  FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;

-- room_id 단독 조회(방 삭제 시 CASCADE)를 위한 인덱스. PK 는 user_id 가 선두라 쓰이지 않는다.
CREATE INDEX room_members_room_id_idx ON public.room_members (room_id);

ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;

-- 클라이언트는 이 테이블을 직접 만지지 않는다. 오직 SECURITY DEFINER 함수만 접근한다.
CREATE POLICY room_members_select ON public.room_members FOR SELECT USING (false);
CREATE POLICY room_members_insert ON public.room_members FOR INSERT WITH CHECK (false);
CREATE POLICY room_members_update ON public.room_members FOR UPDATE USING (false);
CREATE POLICY room_members_delete ON public.room_members FOR DELETE USING (false);

-- 기본 권한(ALTER DEFAULT PRIVILEGES)으로 자동 부여되는 테이블 권한을 회수한다.
-- RLS 가 이미 막고 있지만, 정책이 잘못 바뀌어도 뚫리지 않도록 두 겹으로 둔다.
REVOKE ALL ON public.room_members FROM anon, authenticated;

-- ─────────────────────────────────────────────
-- 소속 판정 헬퍼
-- ─────────────────────────────────────────────

-- 정책 안에서 room_members 를 직접 조회하면 그 테이블의 RLS 까지 평가된다.
-- SECURITY DEFINER 로 감싸 RLS 를 우회하고, STABLE 로 표시해 행마다 재실행되지 않게 한다.
CREATE OR REPLACE FUNCTION public.is_room_member(p_room_id uuid)
  RETURNS boolean
  LANGUAGE sql
  SECURITY DEFINER
  STABLE
  SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM room_members
    WHERE room_id = p_room_id
      AND user_id = auth.uid()
  );
$function$;

GRANT EXECUTE ON FUNCTION public.is_room_member(uuid) TO anon, authenticated;

-- ─────────────────────────────────────────────
-- 소유권 주장
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.claim_room(p_room_id uuid, p_secret_token uuid)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION '로그인이 필요해요.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM room_secrets
    WHERE room_id = p_room_id
      AND secret_token = p_secret_token
  ) THEN
    RAISE EXCEPTION '방을 만든 기기에서만 등록할 수 있어요.';
  END IF;

  INSERT INTO room_members (user_id, room_id)
  VALUES (auth.uid(), p_room_id)
  ON CONFLICT DO NOTHING;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.claim_room(uuid, uuid) TO authenticated;

-- ─────────────────────────────────────────────
-- 방 삭제 개방
-- ─────────────────────────────────────────────

-- 소속된 방만 지울 수 있다. musics, room_secrets, room_members 는 CASCADE 로 함께 정리된다.
-- 허용 방향이라 구버전 클라이언트에 영향이 없다(방 삭제를 호출하지 않는다).
ALTER POLICY rooms_delete ON public.rooms
  USING (is_room_member(id));
