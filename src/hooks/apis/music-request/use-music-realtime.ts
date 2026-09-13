import {
  YoutubeVideo,
  getMusicRequestRoom,
} from '@/apis/music-request/musicRequest';
import { supabase } from '@/utils/supabase';
import { useEffect, useRef, useState, useCallback } from 'react';

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

type PendingEvent =
  | { type: 'insert'; music: YoutubeVideo }
  | { type: 'delete'; id: number };

/**
 * Supabase Realtime을 이용한 음악 목록 실시간 구독 훅
 *
 * 핵심 설계:
 * 1) cancelled 플래그 — Strict Mode 이중 마운트 시 stale 클로저가 상태를 오염시키지 않도록 차단
 * 2) 채널 신원 비교 — connect() 는 이전 채널을 정리하며 그 채널의 콜백을 CLOSED 로 동기 호출한다.
 *    어느 채널에서 온 콜백인지 구분하지 않으면 재시도가 자기 자신을 물고 도는 루프가 된다.
 * 3) 구독 먼저 → 초기 로드 나중 — 구독이 확정(SUBSCRIBED)된 후 초기 데이터를 불러와서 누락 방지
 * 4) 이벤트 버퍼링 — 초기 로드 완료 전 도착한 Realtime 이벤트를 버퍼에 쌓고,
 *    로드 완료 후 knownIds 기준으로 중복을 걸러내며 replay
 *
 * 개발 모드 주의:
 * StrictMode 이중 마운트로 채널이 만들어졌다 곧바로 정리되는데, supabase 는 마지막 채널이
 * 사라질 때 소켓까지 끊는다. 내려가는 소켓 위에서 다음 채널이 join 을 시도해 10초(기본 join
 * 타임아웃)를 기다린 뒤에야 연결되고, 콘솔에 "WebSocket is closed before the connection is
 * established" 가 찍힌다. 프로덕션 빌드에서는 재현되지 않으므로 쫓지 않아도 된다.
 */
export function useMusicRealtime(
  roomId: string,
  handleMusicInit: (musicList: YoutubeVideo[]) => void,
  handleMusicUpdate: (newMusic: YoutubeVideo) => void,
  handleMusicDelete: (deletedId: number) => void,
  handleRoomTitleUpdate: (newRoomTitle: string) => void,
) {
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected' | 'reconnecting'
  >('disconnected');
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const knownIdsRef = useRef<Set<number>>(new Set());
  const [reconnectKey, setReconnectKey] = useState(0);

  useEffect(() => {
    if (!roomId) return undefined;

    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let initialLoadDone = false;
    const pendingEvents: PendingEvent[] = [];

    retryCountRef.current = 0;
    knownIdsRef.current.clear();

    const cleanupChannel = () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      if (channel) {
        // removeChannel 은 그 채널의 subscribe 콜백을 CLOSED 로 동기 호출한다.
        // channel 을 먼저 비워야 그 콜백이 "교체된 채널"로 판정되어 재시도를 유발하지 않는다.
        const previousChannel = channel;
        channel = null;
        supabase.removeChannel(previousChannel);
      }
    };

    const applyInsert = (music: YoutubeVideo) => {
      if (knownIdsRef.current.has(music.id)) return;
      knownIdsRef.current.add(music.id);
      handleMusicUpdate(music);
    };

    const applyDelete = (id: number) => {
      if (!knownIdsRef.current.has(id)) return;
      knownIdsRef.current.delete(id);
      handleMusicDelete(id);
    };

    const flushPendingEvents = () => {
      pendingEvents.forEach((event) => {
        if (cancelled) return;
        if (event.type === 'insert') applyInsert(event.music);
        else applyDelete(event.id);
      });
      pendingEvents.length = 0;
    };

    const connect = () => {
      cleanupChannel();
      if (cancelled) return;

      initialLoadDone = false;
      pendingEvents.length = 0;
      setConnectionStatus('reconnecting');

      // cleanupChannel() 이 이전 채널을 닫으면 그 채널의 콜백이 CLOSED 로 뒤늦게 불린다.
      // 어느 채널에서 온 콜백인지 구분하지 않으면 재시도가 스스로를 물고 도는 루프가 된다.
      const nextChannel = supabase.channel(`room-${roomId}`);
      channel = nextChannel;

      nextChannel
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'musics',
            filter: `roomId=eq.${roomId}`,
          },
          (payload) => {
            if (cancelled) return;
            const newMusic = payload.new as YoutubeVideo & {
              roomId: string;
            };
            if (newMusic.roomId !== roomId) return;

            if (!initialLoadDone) {
              pendingEvents.push({ type: 'insert', music: newMusic });
              return;
            }
            applyInsert(newMusic);
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'musics',
            filter: `roomId=eq.${roomId}`,
          },
          (payload) => {
            if (cancelled) return;
            // musics는 REPLICA IDENTITY FULL이라 서버에서 이 방의 이벤트만 걸러 보낸다.
            // payload.old의 컬럼 구성에 의존하지 않도록 knownIdsRef 판별은 그대로 둔다.
            const old = payload.old as { id: number };

            if (!initialLoadDone) {
              pendingEvents.push({ type: 'delete', id: old.id });
              return;
            }
            applyDelete(old.id);
          },
        )
        .subscribe(async (status) => {
          // 이미 교체된 채널에서 온 콜백은 무시한다
          if (cancelled || channel !== nextChannel) return;

          if (status === 'SUBSCRIBED') {
            retryCountRef.current = 0;

            // 구독 확정 후 초기 데이터 로드
            try {
              const roomData = await getMusicRequestRoom({ roomId });
              if (cancelled) return;

              knownIdsRef.current = new Set(
                roomData.musicList.map((m) => m.id),
              );
              handleMusicInit(roomData.musicList);
              handleRoomTitleUpdate(roomData.roomTitle);
            } catch (err) {
              if (!cancelled) {
                console.error('초기 음악 목록 로드 실패:', err);
              }
            }

            if (cancelled) return;

            // 버퍼에 쌓인 이벤트를 knownIds 기준으로 중복 제거하며 replay
            initialLoadDone = true;
            flushPendingEvents();
            setConnectionStatus('connected');

            return;
          }

          // SUBSCRIBED 외의 상태(CHANNEL_ERROR / TIMED_OUT / CLOSED)는 모두 재시도 대상이다.
          // 하나라도 빠뜨리면 그 상태에 도달했을 때 'reconnecting' 인 채로 멈춘다.
          if (retryCountRef.current < MAX_RETRIES) {
            const delay = BASE_DELAY_MS * 2 ** retryCountRef.current;
            retryCountRef.current += 1;
            setConnectionStatus('reconnecting');
            retryTimerRef.current = setTimeout(connect, delay);
          } else {
            setConnectionStatus('disconnected');
          }
        });
    };

    connect();

    return () => {
      cancelled = true;
      cleanupChannel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, reconnectKey]);

  const reconnect = useCallback(() => {
    retryCountRef.current = 0;
    setReconnectKey((k) => k + 1);
  }, []);

  // 익명 세션도 주기적으로 토큰을 갱신하고, 그때 realtime 소켓이 재설정된다.
  // 교사가 수업 내내 화면을 켜두는 사용 패턴이라 갱신 시점에 조용히 끊기면 체감이 크다.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'TOKEN_REFRESHED') {
        reconnect();
      }
    });

    return () => subscription.unsubscribe();
  }, [reconnect]);

  return [connectionStatus, reconnect] as const;
}
