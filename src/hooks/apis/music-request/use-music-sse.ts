import {
  YoutubeVideo,
  getMusicRequestRoom,
} from '@/apis/music-request/musicRequest';
import { supabase } from '@/utils/supabase';
import { useEffect, useRef, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Supabase Realtime을 이용한 음악 목록 실시간 구독 훅
 * (기존 SSE/EventSource 방식 대체)
 */
export function useMusicSSE(
  roomId: string,
  handleMusicInit: (musicList: YoutubeVideo[]) => void,
  handleMusicUpdate: (newMusic: YoutubeVideo) => void,
  handleMusicDelete: (deletedId: number) => void,
  handleRoomTitleUpdate: (newRoomTitle: string) => void,
) {
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected' | 'reconnecting'
  >('disconnected');
  const channelRef = useRef<RealtimeChannel | null>(null);

  const connect = async () => {
    if (!roomId) return;

    setConnectionStatus('reconnecting');

    // 1) 초기 데이터 로드 (기존 room-update 이벤트 대체)
    try {
      const roomData = await getMusicRequestRoom({ roomId });
      handleMusicInit(roomData.musicList);
      handleRoomTitleUpdate(roomData.roomTitle);
    } catch (err) {
      console.error('초기 음악 목록 로드 실패:', err);
    }

    // 2) Supabase Realtime 구독
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'musics',
          filter: `roomId=eq.${roomId}`,
        },
        (payload) => {
          const newMusic = payload.new as YoutubeVideo;
          handleMusicUpdate(newMusic);
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
          const deletedId = (payload.old as { id: number }).id;
          handleMusicDelete(deletedId);
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
        } else if (status === 'CLOSED') {
          setConnectionStatus('disconnected');
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('disconnected');
        }
      });

    channelRef.current = channel;
  };

  useEffect(() => {
    if (roomId) {
      connect();
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setConnectionStatus('disconnected');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const reconnectSse = async () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    await connect();
  };

  return [connectionStatus, reconnectSse] as const;
}
