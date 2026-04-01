'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card } from '@/components/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import { Poll } from '@/types/quickpoll';
import {
  Copy,
  StopCircle,
  Play,
  Plus,
  RotateCcw,
  RotateCw,
  RefreshCw,
  Link,
  Home,
  GripVertical,
  Trash2,
} from 'lucide-react';
import {
  updatePollStatus,
  getPollResults,
} from '@/apis/quickpoll/quickpollRequest';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';

interface PollAdminPanelProps {
  poll: Poll;
  onStatusChange?: () => void;
}

export default function PollAdminPanel({
  poll,
  onStatusChange,
}: PollAdminPanelProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pollResults, setPollResults] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  const pollUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/quickpoll?id=${poll.id}`
      : '';

  // 투표 결과 로드
  useEffect(() => {
    const loadResults = async () => {
      try {
        const results = await getPollResults(poll.id);
        setPollResults(results);
      } catch (error) {
        console.error('Failed to load poll results:', error);
      }
    };
    loadResults();
  }, [poll.id]);

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(pollUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: '복사됨',
      description: '투표 링크가 복사되었습니다.',
    });
  };

  const handleStatusChange = async (status: 'active' | 'closed') => {
    if (!poll.secretToken) {
      toast({
        title: '오류',
        description: '비밀 토큰이 없습니다.',
        variant: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      await updatePollStatus(poll.id, status, poll.secretToken);
      toast({
        title: '변경됨',
        description: `투표 상태가 "${status === 'active' ? '진행중' : '종료'}"으로 변경되었습니다.`,
      });
      onStatusChange?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '상태 변경에 실패했습니다.';
      toast({
        title: '오류',
        description: message,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetVotes = async () => {
    if (!poll.secretToken) return;
    if (
      !confirm(
        '정말로 모든 투표 데이터를 초기화하시겠습니까? 이전 투표 데이터가 완전히 삭제되며, 참가자들이 다시 투표할 수 있습니다.',
      )
    )
      return;

    setLoading(true);
    try {
      const { resetPollVotes } = await import(
        '@/apis/quickpoll/quickpollRequest'
      );
      await resetPollVotes(poll.id, poll.secretToken);

      toast({
        title: '초기화됨',
        description: '투표 데이터가 모두 삭제되었습니다.',
      });
      const results = await getPollResults(poll.id);
      setPollResults(results);
      onStatusChange?.();
    } catch {
      toast({
        title: '오류',
        description: '초기화에 실패했습니다.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── active 상태 화면 ───
  if (poll.status === 'active') {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        {/* 홈 버튼 */}
        <div className="flex items-center gap-2">
          <Button
            variant="gray-ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={() => router.push('/quickpoll')}
          >
            <Home className="w-4 h-4" />
            홈
          </Button>
        </div>

        {/* 제목 및 상태 */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-600">진행중</span>
          </div>
          <h1 className="text-3xl font-bold">{poll.title}</h1>
          <p className="text-muted-foreground mt-1">
            {pollResults?.totalVotes || 0}명 투표 · 1인 최대{' '}
            {poll.maxVotesPerPerson}표
          </p>
        </div>

        {/* 참가자 투표 링크 */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Link className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">참가자 투표 링크</h3>
          </div>
          <div className="flex gap-2">
            <Input
              value={pollUrl}
              readOnly
              className="text-sm bg-muted border-0"
            />
            <Button
              onClick={handleCopyUrl}
              size="sm"
              variant="gray-outline"
              className="gap-2 shrink-0"
            >
              <Copy className="w-4 h-4" />
              {copied ? '복사됨' : '복사'}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="gray-outline" className="shrink-0">
                  QR
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>QR 코드</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center py-8">
                  <QRCodeSVG value={pollUrl} size={256} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* 투표 종료 버튼 */}
        <Button
          onClick={() => handleStatusChange('closed')}
          disabled={loading}
          variant="red"
          className="w-full gap-2"
          size="lg"
        >
          <StopCircle className="w-5 h-5" />
          투표 종료
        </Button>
      </div>
    );
  }

  // ─── draft / closed 상태 화면 ───
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* 홈 버튼 */}
      <div className="flex items-center gap-2">
        <Button
          variant="gray-ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={() => router.push('/quickpoll')}
        >
          <Home className="w-4 h-4" />
          홈
        </Button>
      </div>

      {/* 제목 및 상태 */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              poll.status === 'closed' ? 'bg-red-400' : 'bg-yellow-400'
            }`}
          />
          <span
            className={`text-sm font-medium ${
              poll.status === 'closed'
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}
          >
            {poll.status === 'closed' ? '종료됨' : '준비중'}
          </span>
        </div>
        <h1 className="text-3xl font-bold">{poll.title}</h1>
        <p className="text-muted-foreground mt-1">
          {pollResults?.totalVotes || 0}명 투표 · 1인 최대{' '}
          {poll.maxVotesPerPerson}표
        </p>
      </div>

      {/* 액션 버튼: 새로/이어/다시하기 */}
      <div className="flex gap-2">
        <Button
          variant="gray-outline"
          className="flex-1 gap-2"
          onClick={handleResetVotes}
          disabled={loading}
        >
          <RotateCcw className="w-4 h-4" />
          다시하기
        </Button>
        <Button
          variant="gray-outline"
          className="flex-1 gap-2"
          onClick={() => handleStatusChange('active')}
          disabled={loading}
        >
          <RotateCw className="w-4 h-4" />
          이어하기
        </Button>
        <Button
          variant="gray-outline"
          className="flex-1 gap-2"
          onClick={() => router.push('/quickpoll')}
        >
          <RefreshCw className="w-4 h-4" />
          새로하기
        </Button>
      </div>

      {/* 투표 항목 목록 (편집 폼 영역) */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground">
          투표 항목
        </h3>
        {poll.options && poll.options.length > 0 ? (
          <div className="space-y-2">
            {poll.options.map((option, idx) => (
              <div
                key={option.id}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab" />
                <span className="text-sm font-semibold text-muted-foreground w-5">
                  {idx + 1}
                </span>
                {option.imageUrl && (
                  <img
                    src={option.imageUrl}
                    alt={option.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{option.title}</p>
                  {option.description && (
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}
        <Button
          type="button"
          variant="gray-outline"
          className="w-full gap-2 text-muted-foreground"
          disabled
        >
          <Plus className="w-4 h-4" />
          항목 추가 (준비중)
        </Button>
      </Card>

      {/* 투표 시작 버튼 */}
      <Button
        onClick={() => handleStatusChange('active')}
        disabled={loading}
        className="w-full gap-2"
        size="lg"
      >
        <Play className="w-5 h-5" />
        투표 시작
      </Button>
    </div>
  );
}
