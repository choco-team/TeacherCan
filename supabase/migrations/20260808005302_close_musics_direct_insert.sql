-- musics 직접 INSERT 경로 차단
--
-- 학생과 교사의 곡 신청이 모두 add_music RPC 를 거치도록 전환되었으므로
-- 클라이언트가 musics 에 직접 INSERT 하는 경로를 닫는다.
-- add_music 은 SECURITY DEFINER 라 이 정책의 영향을 받지 않는다.
--
-- 이로써 anon 키로 임의의 방에 곡을 밀어넣던 경로가 막힌다.

ALTER POLICY musics_insert ON public.musics
  WITH CHECK (false);
