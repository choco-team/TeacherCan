'use client';

import { useState } from 'react';
import { CalendarDays, PlusCircle, LogIn, ArrowLeft } from 'lucide-react';
import SetupPage from '@/containers/shared-time-table/setup-page';

// 👇 프로젝트 경로에 맞게 Heading import 경로를 수정해 주세요.
import { Heading1, Heading2 } from '@/components/heading';
import { Button } from '@/components/button';

type ViewState = 'home' | 'setup' | 'admin-grid' | 'view';

export default function SharedTimeTablePage() {
  const [currentView, setCurrentView] = useState<ViewState>('home');

  // --- 1. 서비스 홈 화면 ---
  if (currentView === 'home') {
    return (
      <div className="flex flex-col items-center bg-background px-4 pt-32 pb-10">
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <CalendarDays className="h-8 w-8 text-primary" />
          </div>
          <Heading1 className="mb-2 justify-center">공용시간표</Heading1>
          <p className="text-sm text-muted-foreground">
            학교 전체의 시간표를 단 하나의 방에서 통합 관리하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* 만들기 버튼 (관리자용) */}
          <Button
            asChild
            variant="gray-outline"
            className="group h-auto flex-col rounded-2xl border-border bg-card p-10 hover:border-primary-600 hover:bg-card hover:shadow-md"
          >
            <button onClick={() => setCurrentView('setup')}>
              <PlusCircle className="mb-4 h-12 w-12 text-primary transition-transform group-hover:scale-110" />
              <Heading2 className="mb-1 group-hover:text-primary-600 transition-colors">
                공용시간표 만들기
              </Heading2>
              <p className="text-xs text-muted-foreground font-normal">
                연구부장 전용 통합 방 개설
              </p>
            </button>
          </Button>

          {/* 참여하기 버튼 (일반 교사용) */}
          <Button
            asChild
            variant="gray-outline"
            className="group h-auto flex-col rounded-2xl border-border bg-card p-10 hover:border-emerald-500/50 hover:bg-card hover:shadow-md"
          >
            <button onClick={() => setCurrentView('view')}>
              <LogIn className="mb-4 h-12 w-12 text-emerald-500 transition-transform group-hover:scale-110" />
              <Heading2 className="mb-1 group-hover:text-emerald-600 transition-colors">
                공용시간표 참여하기
              </Heading2>
              <p className="text-xs text-muted-foreground font-normal">
                참여코드로 우리 반 시간표 조회
              </p>
            </button>
          </Button>
        </div>
      </div>
    );
  }

  // --- 임시: 뒤로가기 헤더 ---
  const renderHeader = (title: string) => (
    <div className="mb-6 flex items-center gap-3">
      <Button
        onClick={() => setCurrentView('home')}
        variant="gray-ghost"
        size="icon"
        className="rounded-full"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <Heading2 className="flex-1">{title}</Heading2>
    </div>
  );

  // --- 2. 초기 세팅 화면 (관리자) ---
  if (currentView === 'setup') {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-6 mt-8">
          {renderHeader('기본 구성 설정')}
          <SetupPage
            onComplete={(setupData) => {
              // eslint-disable-next-line no-console
              console.log('입력된 데이터:', setupData);
              setCurrentView('admin-grid');
            }}
          />
        </div>
      </div>
    );
  }

  // --- 3. 시간표 만들기 화면 (관리자용 격자 뷰) ---
  if (currentView === 'admin-grid') {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {renderHeader('시간표 짜기 (관리자)')}
          <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            여기에 과목별 탭과 시간표를 클릭해서 반을 배정하는 격자 UI가 들어갈
            예정입니다.
          </div>
        </div>
      </div>
    );
  }

  // --- 4. 시간표 조회 화면 (참여교사) ---
  if (currentView === 'view') {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {renderHeader('우리 반 시간표 조회')}
          <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            여기에 코드를 입력하고 들어온 교사용 읽기 전용(Read-only) 뷰가
            들어갈 예정입니다.
          </div>
        </div>
      </div>
    );
  }

  return null;
}
