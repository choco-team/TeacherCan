-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

SET check_function_bodies = false;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO service_role;

CREATE FUNCTION public.create_room (
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

    RETURN v_room_id;
  END;
  $function$;

GRANT ALL ON FUNCTION public.create_room(text, uuid) TO anon;

GRANT ALL ON FUNCTION public.create_room(text, uuid) TO authenticated;

GRANT ALL ON FUNCTION public.create_room(text, uuid) TO service_role;

CREATE FUNCTION public.delete_music (
  p_room_id      uuid,
  p_music_id     text,
  p_secret_token uuid
)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
BEGIN
  -- 1) 방을 최초 생성했던 진짜 주인인지 토큰 검증
  IF NOT EXISTS (
    SELECT 1
    FROM room_secrets
    WHERE room_id = p_room_id
      AND secret_token = p_secret_token
  ) THEN
    -- 토큰이 틀리면 에러를 터트리고 중단 (해킹 방어)
    RAISE EXCEPTION 'Unauthorized: 삭제 권한이 없는 가짜 열쇠입니다.';
  END IF;

  -- 2) 토큰 검증에 성공했다면, 방해받지 않고 안전하게 음악 삭제!
  DELETE FROM musics
  WHERE "roomId" = p_room_id
    AND "musicId" = p_music_id;
END;
$function$;

GRANT ALL ON FUNCTION public.delete_music(uuid, text, uuid) TO anon;

GRANT ALL ON FUNCTION public.delete_music(uuid, text, uuid) TO authenticated;

GRANT ALL ON FUNCTION public.delete_music(uuid, text, uuid) TO service_role;

CREATE TABLE public.musics (
  id            bigint                   GENERATED ALWAYS AS IDENTITY NOT NULL,
  "musicId"     text                     NOT NULL,
  title         text                     NOT NULL,
  "roomId"      uuid                     NOT NULL,
  "studentName" text,
  "timeStamp"   timestamp with time zone DEFAULT now() NOT NULL
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.musics;

ALTER TABLE public.musics
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.musics
  REPLICA IDENTITY FULL;

ALTER TABLE public.musics
  ADD CONSTRAINT musics_pkey PRIMARY KEY (id);

ALTER TABLE public.musics
  ADD CONSTRAINT musics_room_music_unique UNIQUE ("roomId", "musicId");

GRANT ALL ON public.musics TO anon;

GRANT ALL ON public.musics TO authenticated;

GRANT ALL ON public.musics TO service_role;

CREATE POLICY musics_delete ON public.musics
  FOR DELETE
  USING (false);

CREATE POLICY musics_insert ON public.musics
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY musics_select ON public.musics
  FOR SELECT
  USING (true);

CREATE POLICY musics_update ON public.musics
  FOR UPDATE
  USING (false);

CREATE TABLE public.room_secrets (
  id           bigint                   GENERATED ALWAYS AS IDENTITY NOT NULL,
  room_id      uuid                     NOT NULL,
  secret_token uuid                     DEFAULT gen_random_uuid() NOT NULL,
  created_at   timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.room_secrets
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.room_secrets
  ADD CONSTRAINT room_secrets_pkey PRIMARY KEY (id);

ALTER TABLE public.room_secrets
  ADD CONSTRAINT room_secrets_room_id_key UNIQUE (room_id);

GRANT ALL ON public.room_secrets TO anon;

GRANT ALL ON public.room_secrets TO authenticated;

GRANT ALL ON public.room_secrets TO service_role;

CREATE POLICY room_secrets_delete ON public.room_secrets
  FOR DELETE
  USING (false);

CREATE POLICY room_secrets_insert ON public.room_secrets
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY room_secrets_select ON public.room_secrets
  FOR SELECT
  USING (false);

CREATE POLICY room_secrets_update ON public.room_secrets
  FOR UPDATE
  USING (false);

CREATE TABLE public.rooms (
  id            uuid                     DEFAULT gen_random_uuid() NOT NULL,
  "roomTitle"   text                     NOT NULL,
  "connectedAt" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.rooms
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.rooms
  ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);

ALTER TABLE public.musics
  ADD CONSTRAINT "musics_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES public.rooms(id) ON DELETE CASCADE;

ALTER TABLE public.room_secrets
  ADD CONSTRAINT room_secrets_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;

GRANT ALL ON public.rooms TO anon;

GRANT ALL ON public.rooms TO authenticated;

GRANT ALL ON public.rooms TO service_role;

CREATE POLICY rooms_delete ON public.rooms
  FOR DELETE
  USING (false);

CREATE POLICY rooms_insert ON public.rooms
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY rooms_select ON public.rooms
  FOR SELECT
  USING (true);
