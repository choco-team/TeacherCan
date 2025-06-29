import { YoutubeVideo } from '@/apis/music-request/musicRequest';
import { useEffect, useRef } from 'react';

export function useMusicSSE(
  roomId: string,
  onUpdate: (musicList: YoutubeVideo[]) => void,
) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const pingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!roomId) {
      return undefined;
    }

    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      const es = new EventSource(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/music-request/sse?roomId=${roomId}`,
        {
          withCredentials: true,
        },
      );

      es.addEventListener('music-list', (event: MessageEvent) => {
        try {
          const parsed = JSON.parse(event.data);
          onUpdate(parsed.musicList);
        } catch (err) {
          throw new Error('SSE-musicList 파싱 오류');
        }
      });

      es.addEventListener('ping', () => {
        // ping 수신 → 연결 유지 확인됨 -> setTimeout 제거
        if (pingTimeout.current) clearTimeout(pingTimeout.current);
        pingTimeout.current = setTimeout(() => {
          es.close();
          connect(); // 재연결
        }, 20000); // 20초 내 ping 없으면 재연결
      });

      es.onerror = () => {
        es.close();
        reconnectTimeout = setTimeout(connect, 3000);
      };

      eventSourceRef.current = es;
    };

    connect();

    return () => {
      eventSourceRef.current?.close();
      clearTimeout(reconnectTimeout);
      clearTimeout(pingTimeout.current!);
    };
  }, [roomId, onUpdate]);
}
