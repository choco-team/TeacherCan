'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import PollCreateForm from '@/components/poll/poll-create-form';
import PollVotingView from '@/components/poll/poll-voting-view';
import PollResultsView from '@/components/poll/poll-results-view';
import PollAdminPanel from '@/components/poll/poll-admin-panel';
import { useGetPoll } from '@/hooks/apis/quickpoll/use-get-polls';
import { Loader2 } from 'lucide-react';

export default function QuickPollContainer() {
  const searchParams = useSearchParams();
  const [pollId, setPollId] = useState<string | null>(null);
  const [adminSecret, setAdminSecret] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('voting');
  const [mounted, setMounted] = useState(false);

  const { poll, loading, load } = useGetPoll(pollId || undefined);

  const isAdmin = adminSecret && poll?.secretToken === adminSecret;

  useEffect(() => {
    setPollId(searchParams.get('id'));
    setAdminSecret(searchParams.get('secret'));
    setMounted(true);
  }, [searchParams]);

  // 관리자 진입 시 admin 탭으로 자동 전환
  useEffect(() => {
    if (isAdmin) {
      setActiveTab('admin');
    }
  }, [isAdmin]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // 투표 생성 화면 (홈)
  if (!pollId) {
    return (
      <div className="py-8">
        <PollCreateForm />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <p className="text-2xl font-bold mb-2">투표를 찾을 수 없습니다</p>
        <p className="text-muted-foreground">올바른 링크를 확인해주세요</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {isAdmin ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="max-w-4xl mx-auto px-4 pt-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="voting">투표 화면</TabsTrigger>
              <TabsTrigger value="admin">관리 / 결과</TabsTrigger>
            </TabsList>
          </div>

          {/* 참가자 투표 화면 미리보기 */}
          <TabsContent value="voting">
            <PollVotingView poll={poll} onVoteSuccess={() => load(pollId)} />
          </TabsContent>

          {/* 관리자 패널 + 결과 뷰 */}
          <TabsContent value="admin" className="space-y-0">
            <PollAdminPanel poll={poll} onStatusChange={() => load(pollId)} />
            <PollResultsView poll={poll} />
          </TabsContent>
        </Tabs>
      ) : (
        <PollVotingView poll={poll} onVoteSuccess={() => load(pollId)} />
      )}
    </div>
  );
}
