import { YoutubeVideo } from '@/apis/music-request/musicRequest';
import { useEffect } from 'react';

export function useMusicSSE(
  roomId: string,
  onUpdate: (musicList: YoutubeVideo[]) => void,
) {
  useEffect(() => {
    if (!roomId) {
      return undefined;
    }

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/music-request/sse?roomId=${roomId}`,
      {
        withCredentials: true,
      },
    );

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data);
        onUpdate(parsed.musicList);
      } catch (err) {
        throw new Error('SSE 파싱 오류');
      }
    };

    eventSource.onerror = () => {
      throw new Error('music-sse 연결 오류');
    };

    return () => {
      eventSource.close();
    };
  }, [roomId, onUpdate]);
}
