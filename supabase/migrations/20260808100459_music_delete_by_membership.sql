-- 곡 삭제를 소속 기준 RLS 로 이관
--
-- delete_music RPC 는 소유권을 정책으로 표현할 방법이 없던 시절의 우회로였다.
-- localStorage 의 secret_token 을 인자로 받아 함수 안에서 room_secrets 와 대조했다.
--
-- room_members 가 생기면서 방 삭제와 동일하게 정책으로 표현할 수 있게 되었다.
-- 토큰의 역할은 소유권 복구(claim_room) 하나로 좁아진다.
--
-- 허용 방향이라 구버전 클라이언트에 영향이 없다. 구버전은 계속 delete_music 을
-- 호출하고, 그 함수는 SECURITY DEFINER 라 이 정책과 무관하게 동작한다.
-- 함수 제거는 배포 확인 후 별도 마이그레이션에서 한다.

ALTER POLICY musics_delete ON public.musics
  USING (is_room_member("roomId"));

-- 조회 제한 때 authenticated 에게 SELECT 만 남겨뒀으므로 DELETE 를 추가한다.
GRANT DELETE ON public.musics TO authenticated;
