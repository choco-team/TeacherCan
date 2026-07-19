'use client';

import { useState } from 'react';
import { CalendarDays, PlusCircle, LogIn, ArrowLeft } from 'lucide-react';

// 화면 상태 타입: 홈 / 초기세팅(관리자) / 시간표짜기(관리자) / 조회화면(교사/관리자)
type ViewState = 'home' | 'setup' | 'admin-grid' | 'view';

export default function SharedTimeTablePage() {
  const [currentView, setCurrentView] = useState<ViewState>('home');

  // --- 1. 서비스 홈 화면 ---
  if (currentView === 'home') {
    return (
      <div className="flex flex-col items-center bg-background px-4 pt-32 pb-10">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <CalendarDays className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            공용시간표
          </h1>
          <p className="text-sm text-muted-foreground">
            학교 전체의 시간표를 단 하나의 방에서 통합 관리하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* 만들기 버튼 (관리자용) */}
          <button
            onClick={() => setCurrentView('setup')}
            className="group flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 transition-all hover:border-primary/50 hover:shadow-md"
          >
            <PlusCircle className="mb-4 h-12 w-12 text-primary transition-transform group-hover:scale-110" />
            <h2 className="mb-1 text-lg font-bold text-foreground">
              공용시간표 만들기
            </h2>
            <p className="text-xs text-muted-foreground">
              연구부장 전용 통합 방 개설
            </p>
          </button>

          {/* 참여하기 버튼 (일반 교사용) */}
          <button
            onClick={() => setCurrentView('view')}
            className="group flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 transition-all hover:border-emerald-500/50 hover:shadow-md"
          >
            <LogIn className="mb-4 h-12 w-12 text-emerald-500 transition-transform group-hover:scale-110" />
            <h2 className="mb-1 text-lg font-bold text-foreground">
              공용시간표 참여하기
            </h2>
            <p className="text-xs text-muted-foreground">
              참여코드로 우리 반 시간표 조회
            </p>
          </button>
        </div>
      </div>
    );
  }

  // --- 임시: 뒤로가기 헤더 (다른 화면들에서 공통 사용) ---
  const renderHeader = (title: string) => (
    <div className="mb-6 flex items-center gap-3">
      <button
        onClick={() => setCurrentView('home')}
        className="rounded-lg p-2 transition-colors hover:bg-primary/10"
      >
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </button>
      <h1 className="flex-1 text-xl font-bold text-foreground">{title}</h1>
    </div>
  );

  // --- 2. 초기 세팅 화면 (관리자) ---
  if (currentView === 'setup') {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {renderHeader('기본 구성 설정')}
          <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            여기에 방 이름과 반 목록을 추가하는 UI가 들어갈 예정입니다.
          </div>
        </div>
      </div>
    );
  }

  // --- 3. 시간표 조회 화면 (참여교사) ---
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
