import { YoutubeVideo } from '@/apis/music-request/musicRequest';
import { useEffect, useRef, useState } from 'react';

export function useMusicSSE(
  roomId: string,
  handleMusicUpdate: (musicList: YoutubeVideo[]) => void,
  handleRoomTitleUpdate: (newRoomTItle: string) => void,
) {
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected' | 'reconnecting'
  >('disconnected');
  const eventSourceRef = useRef<EventSource | null>(null);
  const pingTimeout = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const retryCount = useRef(0);
  const maxRetries = 5;

  const connect = () => {
    if (retryCount.current >= maxRetries) {
      setConnectionStatus('disconnected');
      return;
    }
    setConnectionStatus('reconnecting');
    retryCount.current += 1;

    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/music-request/sse?roomId=${roomId}`;
    const es = new EventSource(url, { withCredentials: true });

    es.onopen = () => {
      setConnectionStatus('connected');
      retryCount.current = 0;
    };

    es.addEventListener('init-music-list', (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data);
        handleMusicUpdate(parsed.musicList);
        handleRoomTitleUpdate(parsed.roomTitle);
      } catch (err) {
        throw new Error('SSE-musicList 파싱 오류');
      }
    });

    es.addEventListener('music-list', (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data);
        handleMusicUpdate(parsed.musicList);
      } catch (err) {
        throw new Error('SSE-musicList 파싱 오류');
      }
    });

    // NOTE:(정승민)  cloud run 에서 5분마다 연결 끊는것 방지
    es.addEventListener('ping', () => {
      if (pingTimeout.current) clearTimeout(pingTimeout.current); // ping 수신 → 연결 유지 확인됨 -> pingTimeout 제거
      pingTimeout.current = setTimeout(() => {
        setConnectionStatus('reconnecting');
        es.close();
        connect(); // 재연결
      }, 20000); // 20초 내 ping 없으면 재연결
    });

    es.onerror = () => {
      setConnectionStatus('reconnecting');
      es.close();
      reconnectTimeout.current = setTimeout(connect, 3000);
    };

    eventSourceRef.current = es;
  };

  useEffect(() => {
    if (roomId) {
      connect();
    }

    return () => {
      eventSourceRef.current?.close();
      clearTimeout(pingTimeout.current!);
      clearTimeout(reconnectTimeout.current!);
      setConnectionStatus('disconnected');
    };
  }, [roomId, handleMusicUpdate]);

  const reconnectSse = () => {
    retryCount.current = 0;
    connect();
  };
  return [connectionStatus, reconnectSse] as const;
}
