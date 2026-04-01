import { useCallback, useState } from 'react';
import { createPoll } from '@/apis/quickpoll/quickpollRequest';
import { CreatePollRequest, Poll } from '@/types/quickpoll';
import { useToast } from '@/hooks/use-toast';

export function useCreatePoll() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const create = useCallback(
    async (data: CreatePollRequest): Promise<Poll | null> => {
      setLoading(true);
      try {
        const poll = await createPoll(data);
        toast({
          title: '투표 생성 완료',
          description: `"${data.title}" 투표가 생성되었습니다.`,
        });
        return poll;
      } catch (error) {
        const message = error instanceof Error ? error.message : '투표 생성에 실패했습니다.';
        toast({
          title: '오류',
          description: message,
          variant: 'destructive',
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { create, loading };
}
