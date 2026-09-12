'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  PlusCircle,
  LogIn,
  Loader2,
  Clock,
  ArrowRight,
} from 'lucide-react';

import { Heading1, Heading2, Heading3 } from '@/components/heading';
import { Button } from '@/components/button';
import { supabase } from '@/lib/supabase';

type RecentWorkspace = {
  adminCode: string;
  name: string;
  createdAt: string;
};

export default function SharedTimeTablePage() {
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  const [recentWorkspaces, setRecentWorkspaces] = useState<RecentWorkspace[]>(
    [],
  );
  const [joinCode, setJoinCode] = useState('');
  const [isJoinMode, setIsJoinMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('teachercan_recent_workspaces');
    if (saved) {
      try {
        setRecentWorkspaces(JSON.parse(saved));
      } catch (e) {
        console.error('기록 불러오기 실패', e);
      }
    }
  }, []);

  const handleCreateWorkspace = async () => {
    setIsCreating(true);
    try {
      const randomViewCode = Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase();
      const randomAdminCode = crypto.randomUUID().split('-')[4];
      const defaultName = '새 공용시간표 방';

      const { data, error } = await supabase
        .from('workspaces')
        .insert([
          {
            name: defaultName,
            view_code: randomViewCode,
            admin_code: randomAdminCode,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const newWorkspace = {
        adminCode: data.admin_code,
        name: defaultName,
        createdAt: new Date().toLocaleDateString(),
      };
      const updatedWorkspaces = [newWorkspace, ...recentWorkspaces].slice(0, 5);
      localStorage.setItem(
        'teachercan_recent_workspaces',
        JSON.stringify(updatedWorkspaces),
      );

      router.push(`/shared-time-table/admin/${data.admin_code}`);
    } catch (error) {
      console.error('방 생성 실패:', error);
      // eslint-disable-next-line no-alert
      alert('통합 방 생성에 실패했습니다.');
      setIsCreating(false);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    router.push(`/shared-time-table/view/${joinCode.toUpperCase()}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 pt-20 pb-10">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <CalendarDays className="h-8 w-8 text-primary" />
        </div>
        <Heading1 className="mb-2 justify-center">공용시간표</Heading1>
        <p className="text-sm text-muted-foreground">
          학교 전체의 시간표를 단 하나의 방에서 통합 관리하세요.
        </p>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
        <Button
          onClick={handleCreateWorkspace}
          disabled={isCreating}
          variant="gray-outline"
          className="group flex h-auto flex-col rounded-2xl border-border bg-card p-8 hover:border-primary-600 hover:bg-card hover:shadow-md"
        >
          {isCreating ? (
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
          ) : (
            <PlusCircle className="mb-4 h-12 w-12 text-primary transition-transform group-hover:scale-110" />
          )}
          <Heading2 className="mb-1 transition-colors group-hover:text-primary-600">
            공용시간표 만들기
          </Heading2>
          <p className="text-xs font-normal text-muted-foreground">
            관리자 전용 통합 방 개설
          </p>
        </Button>

        {!isJoinMode ? (
          <Button
            onClick={() => setIsJoinMode(true)}
            variant="gray-outline"
            className="group flex h-auto flex-col rounded-2xl border-border bg-card p-8 hover:border-emerald-500/50 hover:bg-card hover:shadow-md"
          >
            <LogIn className="mb-4 h-12 w-12 text-emerald-500 transition-transform group-hover:scale-110" />
            <Heading2 className="mb-1 transition-colors group-hover:text-emerald-600">
              공용시간표 참여하기
            </Heading2>
            <p className="text-xs font-normal text-muted-foreground">
              참여코드로 우리 반 시간표 조회
            </p>
          </Button>
        ) : (
          <div className="flex h-auto flex-col justify-center rounded-2xl border border-emerald-500/50 bg-emerald-50/30 p-8 shadow-sm">
            <Heading2 className="mb-4 text-emerald-600 text-center">
              참여 코드 입력
            </Heading2>
            <form onSubmit={handleJoin} className="flex flex-col gap-3">
              {/* 💡 autoFocus 속성 제거 */}
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="예: A3B8C"
                className="rounded-lg border border-border bg-background p-3 text-center text-xl font-bold tracking-widest uppercase outline-none focus:border-emerald-500"
                maxLength={5}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="gray-ghost"
                  onClick={() => setIsJoinMode(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 border-none"
                >
                  입장하기
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {recentWorkspaces.length > 0 && (
        <div className="mt-16 w-full max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <Heading3 className="text-muted-foreground">
              최근에 관리한 내 시간표 방
            </Heading3>
          </div>
          <div className="flex flex-col gap-3">
            {/* 💡 index 대신 고유한 ws.adminCode를 key로 사용 */}
            {recentWorkspaces.map((ws) => (
              <button
                key={ws.adminCode}
                onClick={() =>
                  router.push(`/shared-time-table/admin/${ws.adminCode}`)
                }
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary hover:bg-primary/5"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <PlusCircle className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">
                      {ws.name || '새 공용시간표 방'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      생성일: {ws.createdAt}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
