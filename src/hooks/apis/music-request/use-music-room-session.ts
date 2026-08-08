import { useCallback, useEffect, useState } from 'react';
import { getMusicRooms } from '@/apis/music-request/music-room-storage';
import { supabase } from '@/utils/supabase';

/**
 * 교사 화면에서 익명 세션을 확보하고, 보관 중인 secret_token 으로 방 소유권을 등록한다.
 *
 * 조회 정책이 room_members 를 기준으로 판단하므로 등록이 끝나기 전에 데이터를 읽거나
 * realtime 을 구독하면 아무것도 받지 못한다. 화면은 isReady 가 true 가 된 뒤에 그려야 한다.
 *
 * 세션은 꼭 필요할 때만 만든다. 익명 계정은 auth.users 에 영구히 쌓이므로,
 * 방이 하나도 없는 교사가 페이지를 구경만 하고 나가는 경우까지 계정을 만들면
 * 실제 사용자 수와 계정 수가 어긋난다.
 *
 * 학생 화면에서는 호출하지 않는다. 학생은 인증 없이 RPC 만 사용한다.
 */

/** 한 번 등록한 사용자는 페이지 이동마다 다시 등록하지 않는다 */
let claimedUserId: string | null = null;

/** 세션이 없으면 익명으로 로그인한다. 방 생성처럼 즉시 세션이 필요한 곳에서도 쓴다. */
export const ensureMusicRoomSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return session.user.id;
  }

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    throw new Error(error.message);
  }

  return data.user?.id ?? null;
};

const claimStoredRooms = async () => {
  // 이미 등록된 방은 ON CONFLICT DO NOTHING 으로 조용히 넘어간다.
  // 삭제된 방은 secret 이 함께 사라져 실패하지만, 다른 방 등록을 막지 않는다.
  await Promise.all(
    Object.entries(getMusicRooms()).map(([roomId, token]) =>
      supabase.rpc('claim_room', {
        p_room_id: roomId,
        p_secret_token: token,
      }),
    ),
  );
};

type Params = {
  /** 읽을 방이 있을 때만 세션을 만든다 */
  enabled: boolean;
};

export const useMusicRoomSession = ({ enabled }: Params) => {
  const [isPrepared, setIsPrepared] = useState(false);
  const [isError, setIsError] = useState(false);

  const prepare = useCallback(async () => {
    try {
      const userId = await ensureMusicRoomSession();

      if (userId && claimedUserId !== userId) {
        await claimStoredRooms();
        claimedUserId = userId;
      }

      setIsPrepared(true);
    } catch (error) {
      console.error('음악신청 세션 준비 실패:', error);
      setIsError(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    setIsPrepared(false);
    prepare();
  }, [enabled, prepare]);

  // enabled 를 파생값으로 함께 판단한다.
  // 상태로만 두면 enabled 가 켜지기 한 렌더 전에 준비 완료로 보여서,
  // 화면이 잠깐 열렸다 닫히며 realtime 연결이 한 번 버려진다.
  return { isReady: !enabled || isPrepared, isError };
};
