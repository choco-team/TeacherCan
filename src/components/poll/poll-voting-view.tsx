'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card } from '@/components/card';
import { Dialog, DialogContent, DialogDescription } from '@/components/dialog';
import { Poll } from '@/types/quickpoll';
import { PartyPopper, Vote, Clock, X, Loader2 } from 'lucide-react';
import { getPollVotes } from '@/apis/quickpoll/quickpollRequest';
import { useCastVote } from '@/hooks/apis/quickpoll/use-cast-vote';

const DEVICE_ID_KEY = 'quickpoll-device-id';

function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

interface PollVotingViewProps {
  poll: Poll;
  onVoteSuccess?: () => void;
}

export default function PollVotingView({
  poll,
  onVoteSuccess,
}: PollVotingViewProps) {
  const [name, setName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isCheckingVoted, setIsCheckingVoted] = useState(true);
  const { cast, loading } = useCastVote();

  useEffect(() => {
    const checkVoteStatus = async () => {
      // 미리보기 모드는 투표 상태 체크 불필요
      if (poll.id === 'preview') {
        setIsCheckingVoted(false);
        return;
      }

      const id = getDeviceId();
      setDeviceId(id);

      // 내가 투표했는지 로컬 스토리지에 기록된 정보 찾기
      const votedKey = `quickpoll-voted-${poll.id}`;
      const hasVotedLocal = localStorage.getItem(votedKey) === 'true';

      if (hasVotedLocal) {
        // 서버/DB에도 기록이 남아있는지(즉, 방금 관리자가 리셋하지 않았는지) 검사
        try {
          const votes = await getPollVotes(poll.id);
          // 투표 내역이 하나도 없으면 리셋된 것으로 간주, 로컬 기록 초기화
          if (votes.length === 0) {
            localStorage.removeItem(votedKey);
            setSubmitted(false);
          } else {
            setSubmitted(true);
          }
        } catch (e) {
          console.error('Failed to fetch votes to verify status', e);
        }
      }
      setIsCheckingVoted(false);
    };
    checkVoteStatus();
  }, [poll.id, poll.updatedAt]);


  const toggleOption = (optionId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((x) => x !== optionId);
      }
      if (prev.length >= poll.maxVotesPerPerson) return prev;
      return [...prev, optionId];
    });
  };

  const handleSubmit = async () => {
    if (!name.trim() || selectedIds.length === 0) return;

    const success = await cast({
      pollId: poll.id,
      participantName: name.trim(),
      selectedOptionIds: selectedIds,
    });

    if (success) {
      localStorage.setItem(`quickpoll-voted-${poll.id}`, 'true');
      setSubmitted(true);
      onVoteSuccess?.();
    }
  };

  if (isCheckingVoted) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (poll.status !== 'active') {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card className="p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-muted">
            <Vote className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">
            {poll.status === 'draft'
              ? '투표가 아직 시작되지 않았습니다'
              : '투표가 종료되었습니다'}
          </p>
          <p className="text-muted-foreground">
            {poll.status === 'draft'
              ? '관리자가 투표를 시작할 때까지 기다려주세요'
              : '결과는 관리자에게 문의해주세요'}
          </p>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card className="p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-lg bg-green-100">
            <PartyPopper className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">투표에 참여했습니다</h2>
            <p className="text-muted-foreground text-lg">
              <span className="font-semibold text-foreground">{name}</span>님,
              투표해주셔서 감사합니다.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-muted text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">결과를 기다려주세요</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card className="p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
            <Vote className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">{poll.title}</h2>
          {poll.description && (
            <p className="text-muted-foreground">{poll.description}</p>
          )}
          <p className="text-sm text-muted-foreground">
            최대{' '}
            <span className="font-semibold text-primary">
              {poll.maxVotesPerPerson}
            </span>
            개 선택 ·{' '}
            <span className="font-semibold text-primary">
              {selectedIds.length}
            </span>
            /{poll.maxVotesPerPerson} 선택됨
          </p>
        </div>

        <Input
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="text-center text-lg"
        />

        <div className="space-y-3">
          {poll.options.map((option) => {
            const selected = selectedIds.includes(option.id);
            return (
              <div key={option.id} className="space-y-2">
                <button
                  onClick={() => toggleOption(option.id)}
                  disabled={loading}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selected
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/30 hover:border-primary/50 disabled:opacity-50'
                  }`}
                >
                  <div className="font-semibold">{option.title}</div>
                  {option.description && (
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                  )}
                </button>
                {option.imageUrl && (
                  <button
                    onClick={() => setSelectedImageUrl(option.imageUrl!)}
                    disabled={loading}
                    className="w-full relative h-40 bg-muted rounded-lg overflow-hidden hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Image
                      src={option.imageUrl}
                      alt={option.title}
                      fill
                      className="object-cover"
                    />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!name.trim() || selectedIds.length === 0 || loading}
          className="w-full"
          size="lg"
        >
          {loading ? '투표 중...' : '투표하기'}
        </Button>

        <Dialog
          open={!!selectedImageUrl}
          onOpenChange={(open) => !open && setSelectedImageUrl(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogDescription>
              <button
                onClick={() => setSelectedImageUrl(null)}
                className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </DialogDescription>
            {selectedImageUrl && (
              <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={selectedImageUrl}
                  alt="확대된 선택지 이미지"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
