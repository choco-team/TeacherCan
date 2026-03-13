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
 * 2) 구독 먼저 → 초기 로드 나중 — 구독이 확정(SUBSCRIBED)된 후 초기 데이터를 불러와서 누락 방지
 * 3) 이벤트 버퍼링 — 초기 로드 완료 전 도착한 Realtime 이벤트를 버퍼에 쌓고,
 *    로드 완료 후 knownIds 기준으로 중복을 걸러내며 replay
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
        supabase.removeChannel(channel);
        channel = null;
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

      channel = supabase
        .channel(`room-${roomId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'musics' },
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
          { event: 'DELETE', schema: 'public', table: 'musics' },
          (payload) => {
            if (cancelled) return;
            // DELETE의 payload.old는 REPLICA IDENTITY 설정에 따라 PK만 올 수 있으므로
            // old.roomId 대신 knownIdsRef로 이 방의 음악인지 판별
            const old = payload.old as { id: number };

            if (!initialLoadDone) {
              pendingEvents.push({ type: 'delete', id: old.id });
              return;
            }
            applyDelete(old.id);
          },
        )
        .subscribe(async (status) => {
          if (cancelled) return;

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
          } else if (status === 'CHANNEL_ERROR') {
            if (retryCountRef.current < MAX_RETRIES) {
              const delay = BASE_DELAY_MS * 2 ** retryCountRef.current;
              retryCountRef.current += 1;
              setConnectionStatus('reconnecting');
              retryTimerRef.current = setTimeout(connect, delay);
            } else {
              setConnectionStatus('disconnected');
            }
          } else if (status === 'CLOSED') {
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

  return [connectionStatus, reconnect] as const;
}
