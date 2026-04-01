import { useCallback, useEffect, useState } from 'react';
import { getPoll, listPolls } from '@/apis/quickpoll/quickpollRequest';
import { Poll } from '@/types/quickpoll';
import { useToast } from '@/hooks/use-toast';

export function useGetPolls() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetch = useCallback(
    async (status?: string) => {
      setLoading(true);
      try {
        const data = await listPolls(status);
        setPolls(data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : '투표 목록 조회에 실패했습니다.';
        toast({
          title: '오류',
          description: message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return { polls, loading, fetch };
}

export function useGetPoll(pollId?: string) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const load = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const data = await getPoll(id);
        setPoll(data);
        return data;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : '투표 조회에 실패했습니다.';
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
    [toast],
  );

  useEffect(() => {
    if (pollId) {
      load(pollId);
    }
  }, [pollId, load]);

  return { poll, loading, load };
}
