import { useCallback, useState } from 'react';
import { castVote, getPollVotes, getPollResults } from '@/apis/quickpoll/quickpollRequest';
import { CastVoteRequest, Vote } from '@/types/quickpoll';
import { useToast } from '@/hooks/use-toast';

export function useCastVote() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const cast = useCallback(
    async (data: CastVoteRequest): Promise<Vote | null> => {
      setLoading(true);
      try {
        const vote = await castVote(data);
        toast({
          title: '투표 완료',
          description: `${data.participantName}님, 투표해주셔서 감사합니다.`,
        });
        return vote;
      } catch (error) {
        const message = error instanceof Error ? error.message : '투표 등록에 실패했습니다.';
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

  return { cast, loading };
}

export function useGetPollVotes(pollId: string) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPollVotes(pollId);
      setVotes(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : '투표 결과 조회에 실패했습니다.';
      toast({
        title: '오류',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [pollId, toast]);

  return { votes, loading, fetch };
}

export function useGetPollResults(pollId: string) {
  const [results, setResults] = useState<{
    options: any[];
    totalVotes: number;
  }>({ options: [], totalVotes: 0 });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPollResults(pollId);
      setResults(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : '투표 결과 조회에 실패했습니다.';
      toast({
        title: '오류',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [pollId, toast]);

  return { results, loading, fetch };
}
