import { getVoteTeacherSnapshot, VoteTeacherSnapshot } from '@/apis/vote/vote';
import { supabase } from '@/utils/supabase';
import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

export function useVoteRealtime(
  roomId: string,
  handleSnapshot: (snapshot: VoteTeacherSnapshot) => void,
) {
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected' | 'reconnecting'
  >('disconnected');
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [reconnectKey, setReconnectKey] = useState(0);

  useEffect(() => {
    if (!roomId) return undefined;

    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let initialLoadDone = false;
    let pendingReload = false;
    let fetching = false;

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

    const refreshSnapshot = async () => {
      if (cancelled || fetching) return;
      fetching = true;
      try {
        const snapshot = await getVoteTeacherSnapshot({ roomId });
        if (cancelled) return;
        handleSnapshot(snapshot);
      } catch (error) {
        if (!cancelled) {
          console.error('투표 스냅샷 갱신 실패:', error);
        }
      } finally {
        fetching = false;
      }
    };

    const queueRefresh = () => {
      if (!initialLoadDone) {
        pendingReload = true;
        return;
      }
      refreshSnapshot();
    };

    const connect = () => {
      cleanupChannel();
      if (cancelled) return;

      initialLoadDone = false;
      pendingReload = false;
      setConnectionStatus('reconnecting');

      channel = supabase
        .channel(`vote-room-${roomId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'vote_ballots' },
          (payload) => {
            const changedRoomId = (payload.new as { roomId?: string }).roomId;
            const deletedRoomId = (payload.old as { roomId?: string }).roomId;
            if (changedRoomId === roomId || deletedRoomId === roomId) {
              queueRefresh();
            }
          },
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'vote_participants' },
          (payload) => {
            const changedRoomId = (payload.new as { roomId?: string }).roomId;
            const deletedRoomId = (payload.old as { roomId?: string }).roomId;
            if (changedRoomId === roomId || deletedRoomId === roomId) {
              queueRefresh();
            }
          },
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'vote_rounds' },
          (payload) => {
            const changedRoomId = (payload.new as { roomId?: string }).roomId;
            const deletedRoomId = (payload.old as { roomId?: string }).roomId;
            if (changedRoomId === roomId || deletedRoomId === roomId) {
              queueRefresh();
            }
          },
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'vote_rooms' },
          (payload) => {
            const changedRoomId = (payload.new as { id?: string }).id;
            const deletedRoomId = (payload.old as { id?: string }).id;
            if (changedRoomId === roomId || deletedRoomId === roomId) {
              queueRefresh();
            }
          },
        )
        .subscribe(async (status) => {
          if (cancelled) return;

          if (status === 'SUBSCRIBED') {
            retryCountRef.current = 0;
            await refreshSnapshot();
            if (cancelled) return;

            initialLoadDone = true;
            if (pendingReload) {
              pendingReload = false;
              await refreshSnapshot();
            }
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
  }, [roomId, reconnectKey, handleSnapshot]);

  const reconnect = useCallback(() => {
    retryCountRef.current = 0;
    setReconnectKey((previous) => previous + 1);
  }, []);

  return [connectionStatus, reconnect] as const;
}
