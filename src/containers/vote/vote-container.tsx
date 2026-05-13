'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  LoaderCircle,
  QrCode,
  RefreshCw,
  Sparkles,
  Timer,
  Users2,
  Vote,
} from 'lucide-react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Heading1 } from '@/components/heading';
import { useCreateVoteRoom } from '@/hooks/apis/vote/use-create-vote-room';

export default function VoteContainer() {
  const router = useRouter();
  const [roomTitle, setRoomTitle] = useState('');
  const { mutate: createVoteRoomMutation, isPending } = useCreateVoteRoom();

  const handleCreateRoom = () => {
    const title = roomTitle.trim();
    if (!title) return;

    createVoteRoomMutation(
      { title },
      {
        onSuccess: ({ roomId }) => {
          setRoomTitle('');
          router.push(`/vote/teacher/${roomId}`);
        },
      },
    );
  };

  return (
    <div className="flex-grow flex flex-col gap-y-5 text-text-title w-full max-w-screen-sm mx-auto">
      <div className="rounded-2xl border border-primary-200/60 bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-5 py-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200 px-3 py-1 text-xs font-semibold">
          <Sparkles className="size-3.5" />
          실시간 클래스 투표
        </div>
        <Heading1 className="mt-3">투표하기</Heading1>
        <p className="mt-2 text-sm text-text-subtitle leading-relaxed">
          질문과 선택지를 만들고 학생을 초대하면, 투표 진행과 결과를 실시간으로
          확인할 수 있어요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 px-3.5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-title">
            <Vote className="size-4 text-primary" />
            빠른 시작
          </div>
          <p className="mt-1 text-xs text-text-subtitle">
            옵션 설정 후 즉시 투표를 시작할 수 있습니다.
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 px-3.5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-title">
            <QrCode className="size-4 text-blue-500" />
            쉬운 참여
          </div>
          <p className="mt-1 text-xs text-text-subtitle">
            링크/QR로 학생을 바로 초대할 수 있습니다.
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 px-3.5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-title">
            <RefreshCw className="size-4 text-emerald-500" />
            재투표 지원
          </div>
          <p className="mt-1 text-xs text-text-subtitle">
            종료 후 선택지를 골라 다시 투표를 만들 수 있습니다.
          </p>
        </div>

        <div className="rounded-xl bg-violet-50 dark:bg-violet-900/20 px-3.5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-title">
            <BarChart3 className="size-4 text-violet-500" />
            결과 분석
          </div>
          <p className="mt-1 text-xs text-text-subtitle">
            실시간 집계와 최종 결과를 바로 확인합니다.
          </p>
        </div>

        <div className="rounded-xl bg-cyan-50 dark:bg-cyan-900/20 px-3.5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-title">
            <Users2 className="size-4 text-cyan-500" />
            실시간 동기화
          </div>
          <p className="mt-1 text-xs text-text-subtitle">
            참여, 시작, 결과가 즉시 반영됩니다.
          </p>
        </div>

        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 px-3.5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-title">
            <Timer className="size-4 text-amber-500" />
            진행 제어
          </div>
          <p className="mt-1 text-xs text-text-subtitle">
            교사가 시작/종료를 제어합니다.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border dark:border-gray-800 bg-white/90 dark:bg-gray-950 px-4 py-4 space-y-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-text-title">
            지금 바로 투표 시작하기
          </h2>
          <p className="text-sm text-text-subtitle">
            투표 제목을 입력하고 만들기 버튼을 눌러 새 투표방을 생성하세요.
          </p>
        </div>
        <Input
          value={roomTitle}
          onChange={(event) => setRoomTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleCreateRoom();
            }
          }}
          placeholder="제목을 입력하세요."
          className="h-12 text-lg"
        />
        <Button
          variant="primary"
          onClick={handleCreateRoom}
          disabled={!roomTitle.trim() || isPending}
          className="h-12 text-base w-full"
        >
          {isPending ? (
            <LoaderCircle className="size-5 text-white animate-spin" />
          ) : (
            '시작하기'
          )}
        </Button>
      </div>
      <ul className="list-disc pl-5 space-y-1 text-xs leading-relaxed text-text-subtitle">
        <li>투표방 목록은 제공하지 않습니다.</li>
        <li>이전 투표방 자동 재입장 기능은 지원하지 않습니다.</li>
        <li>종료된 투표는 다시 시작할 수 없으며, 새로 만들어야 합니다.</li>
        <li>다시 접속하려면 방 주소를 별도로 보관해주세요.</li>
      </ul>
    </div>
  );
}
