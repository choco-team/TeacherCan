'use client';

import { useState } from 'react';
import {
  CalendarDays,
  PlusCircle,
  LogIn,
  ArrowLeft,
  Copy,
  Share2,
  Plus,
  TableProperties,
} from 'lucide-react';
import SetupPage from '@/containers/shared-time-table/setup-page';

import { Heading1, Heading2, Heading3, Heading4 } from '@/components/heading';
import { Button } from '@/components/button';
import TimetableGrid from './time-table-grid';

type ViewState = 'home' | 'admin-dashboard' | 'admin-grid' | 'view';

interface RoomInfo {
  id: string;
  roomName: string;
  classes: string[];
  location: string;
  startDate: string;
  endDate: string;
}

export default function SharedTimeTablePage() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [timetables, setTimetables] = useState<RoomInfo[]>([]);
  const [activeTimetable, setActiveTimetable] = useState<RoomInfo | null>(null);

  const renderHeader = (title: string, backView: ViewState) => (
    <div className="mb-6 flex items-center gap-3">
      <Button
        onClick={() => setCurrentView(backView)}
        variant="gray-ghost"
        size="icon"
        className="rounded-full"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <Heading2 className="flex-1">{title}</Heading2>
    </div>
  );

  // --- 1. 홈 화면 ---
  if (currentView === 'home') {
    return (
      <div className="flex flex-col items-center bg-background px-4 pt-32 pb-10">
        <div className="mb-10 flex flex-col items-center text-center">
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
            asChild
            variant="gray-outline"
            className="group flex h-auto flex-col rounded-2xl border-border bg-card p-10 hover:border-primary-600 hover:bg-card hover:shadow-md"
          >
            <button onClick={() => setCurrentView('admin-dashboard')}>
              <PlusCircle className="mb-4 h-12 w-12 text-primary transition-transform group-hover:scale-110" />
              <Heading2 className="mb-1 transition-colors group-hover:text-primary-600">
                공용시간표 만들기
              </Heading2>
              <p className="text-xs font-normal text-muted-foreground">
                연구부장 전용 통합 방 개설
              </p>
            </button>
          </Button>

          <Button
            asChild
            variant="gray-outline"
            className="group flex h-auto flex-col rounded-2xl border-border bg-card p-10 hover:border-emerald-500/50 hover:bg-card hover:shadow-md"
          >
            <button onClick={() => setCurrentView('view')}>
              <LogIn className="mb-4 h-12 w-12 text-emerald-500 transition-transform group-hover:scale-110" />
              <Heading2 className="mb-1 transition-colors group-hover:text-emerald-600">
                공용시간표 참여하기
              </Heading2>
              <p className="text-xs font-normal text-muted-foreground">
                참여코드로 우리 반 시간표 조회
              </p>
            </button>
          </Button>
        </div>
      </div>
    );
  }

  // --- 2. 관리자 대시보드 ---
  if (currentView === 'admin-dashboard') {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {renderHeader('공용시간표 관리자 대시보드', 'home')}
          {/* 링크 공유 부분 (이전과 동일) */}
          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
              <Heading3 className="mb-1 text-red-600 dark:text-red-400">
                🛠️ 관리자 전용 링크
              </Heading3>
              <p className="mb-4 text-xs text-red-600/80 dark:text-red-400/80">
                이 링크를 꼭 북마크해 주세요! 절대 다른 사람에게 공유하면 안
                됩니다.
              </p>
              <Button variant="red" size="sm" className="w-full gap-2">
                <Copy className="h-4 w-4" />
                관리자 링크 복사
              </Button>
            </div>
            <div className="rounded-2xl border border-primary-200 bg-primary/5 p-6 dark:border-primary-900/50">
              <Heading3 className="mb-1 text-primary">
                👀 선생님 공유용 링크
              </Heading3>
              <p className="mb-4 text-xs text-muted-foreground">
                선생님들께 공유할 읽기 전용 링크입니다. 이 방의 모든 시간표를 볼
                수 있습니다.
              </p>
              <Button variant="primary" size="sm" className="w-full gap-2">
                <Share2 className="h-4 w-4" />
                공유용 링크 복사
              </Button>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <Heading2>내 시간표 목록</Heading2>
            <Button
              onClick={() => {
                setActiveTimetable(null); // 새 시간표이므로 active 비우기
                setCurrentView('admin-grid'); // 💡 setup 대신 바로 에디터 화면으로!
              }}
              variant="primary"
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />새 시간표 추가
            </Button>
          </div>

          {timetables.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-16 text-center">
              <p className="mb-4 text-sm text-muted-foreground">
                아직 생성된 시간표가 없습니다. 새 시간표를 추가해 보세요!
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {timetables.map((tt) => (
                <div
                  key={tt.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <TableProperties className="h-6 w-6" />
                    </div>
                    <div>
                      <Heading4 className="mb-1">{tt.roomName}</Heading4>
                      <p className="text-xs text-muted-foreground">
                        등록된 반: {tt.classes.length}개
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="primary-outline"
                    onClick={() => {
                      setActiveTimetable(tt); // 기존 시간표 데이터 넣기
                      setCurrentView('admin-grid');
                    }}
                  >
                    편집하기
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- 3. 시간표 만들기 & 격자 화면 (✨ Setup과 Grid가 하나로 합쳐짐!) ---
  // --- 3. 시간표 만들기 & 격자 화면 ---
  if (currentView === 'admin-grid') {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-6">
          {renderHeader(
            activeTimetable ? '시간표 편집' : '새 시간표 만들기',
            'admin-dashboard',
          )}

          <div className="space-y-2">
            {/* 상단: 슬림해진 세팅 폼 */}
            <SetupPage
              initialData={activeTimetable || undefined}
              buttonText={
                activeTimetable ? '설정 업데이트' : '시간표 짜기 시작'
              }
              onComplete={(setupData) => {
                if (activeTimetable) {
                  const updated = { ...activeTimetable, ...setupData };
                  setTimetables((prev) =>
                    prev.map((t) => (t.id === updated.id ? updated : t)),
                  );
                  setActiveTimetable(updated);
                } else {
                  const newTimetable = {
                    id: crypto.randomUUID(),
                    ...setupData,
                  };
                  setTimetables((prev) => [...prev, newTimetable]);
                  setActiveTimetable(newTimetable);
                }
              }}
            />

            {/* 👇 임시 텍스트를 지우고, 방금 만든 TimetableGrid를 넣습니다! */}
            {activeTimetable && (
              <TimetableGrid
                timetables={timetables}
                activeTimetable={activeTimetable}
                onTabChange={(tt) => setActiveTimetable(tt)}
              />
            )}
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
          {renderHeader('우리 반 시간표 조회', 'home')}
          <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            여기에 참여 코드를 입력하고 들어온 교사용 읽기 전용(Read-only) 뷰가
            들어갈 예정입니다.
          </div>
        </div>
      </div>
    );
  }

  return null;
}
