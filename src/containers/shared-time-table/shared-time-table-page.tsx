'use client';

import { useState, useEffect } from 'react';
import {
  CalendarDays,
  PlusCircle,
  LogIn,
  ArrowLeft,
  Copy,
  Share2,
  Plus,
  TableProperties,
  Loader2,
} from 'lucide-react';

import SetupPage from '@/containers/shared-time-table/setup-page';
import TimetableGrid, {
  RoomInfo,
  ScheduleEvent,
} from '@/containers/shared-time-table/time-table-grid';

import { Heading1, Heading2, Heading3, Heading4 } from '@/components/heading';
import { Button } from '@/components/button';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/toast';

import { supabase } from '@/lib/supabase';

type ViewState = 'home' | 'admin-dashboard' | 'admin-grid' | 'view';

type Workspace = {
  id: string;
  adminCode: string;
  viewCode: string;
};

export default function SharedTimeTablePage() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    null,
  );

  const [timetables, setTimetables] = useState<RoomInfo[]>([]);
  const [activeTimetable, setActiveTimetable] = useState<RoomInfo | null>(null);
  const [allEvents, setAllEvents] = useState<ScheduleEvent[]>([]);

  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  // 💡 사이트 기본 주소(예: localhost:3000)를 안전하게 가져오기 위한 변수
  const [baseUrl, setBaseUrl] = useState('');
  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  // 💡 진짜로 텍스트를 클립보드에 복사해주는 마법의 함수
  const handleCopy = (text: string, successMessage: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert(successMessage))
      .catch(() =>
        alert('복사에 실패했습니다. 직접 텍스트를 선택해서 복사해주세요.'),
      );
  };

  const handleCreateWorkspace = async () => {
    setIsCreatingWorkspace(true);
    try {
      // 참여용 코드는 5자리(예: A3B8C)
      const randomViewCode = Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase();

      // 💡 관리자 코드는 길고 복잡한 UUID 대신 '12자리'의 깔끔한 무작위 문자열로 생성!
      const randomAdminCode = crypto.randomUUID().split('-')[4];

      const { data, error } = await supabase
        .from('workspaces')
        .insert([
          {
            view_code: randomViewCode,
            admin_code: randomAdminCode,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setActiveWorkspace({
        id: data.id,
        adminCode: data.admin_code,
        viewCode: data.view_code,
      });
      setCurrentView('admin-dashboard');
    } catch (error) {
      console.error('방 생성 실패:', error);
      // eslint-disable-next-line no-alert
      alert('통합 방 생성에 실패했습니다. 관리자에게 문의해주세요.');
    } finally {
      setIsCreatingWorkspace(false);
    }
  };

  const handleSaveToDB = async () => {
    if (!activeTimetable || !activeWorkspace) return;

    try {
      const { error: ttError } = await supabase.from('timetables').upsert({
        id: activeTimetable.id,
        workspace_id: activeWorkspace.id,
        room_name: activeTimetable.roomName,
        classes: activeTimetable.classes,
        location: activeTimetable.location,
        start_date: activeTimetable.startDate,
        end_date: activeTimetable.endDate,
      });

      if (ttError) throw ttError;

      const { error: deleteError } = await supabase
        .from('schedule_events')
        .delete()
        .eq('timetable_id', activeTimetable.id);

      if (deleteError) throw deleteError;

      const eventsToInsert = allEvents
        .filter((ev) => ev.timetableId === activeTimetable.id)
        .map((ev) => ({
          id: ev.id,
          timetable_id: ev.timetableId,
          day: ev.day,
          period: ev.period,
          class_name: ev.className,
          location: ev.location,
          start_date: ev.startDate,
          end_date: ev.endDate,
        }));

      if (eventsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('schedule_events')
          .insert(eventsToInsert);

        if (insertError) throw insertError;
      }

      setIsToastOpen(true);
      setCurrentView('admin-dashboard');
    } catch (error) {
      console.error('DB 저장 실패:', error);
      // eslint-disable-next-line no-alert
      alert('저장에 실패했습니다. 관리자에게 문의해주세요.');
    }
  };

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

  const renderContent = () => {
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
              onClick={handleCreateWorkspace}
              disabled={isCreatingWorkspace}
              variant="gray-outline"
              className="group flex h-auto flex-col rounded-2xl border-border bg-card p-10 hover:border-primary-600 hover:bg-card hover:shadow-md"
            >
              {isCreatingWorkspace ? (
                <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
              ) : (
                <PlusCircle className="mb-4 h-12 w-12 text-primary transition-transform group-hover:scale-110" />
              )}
              <Heading2 className="mb-1 transition-colors group-hover:text-primary-600">
                공용시간표 만들기
              </Heading2>
              <p className="text-xs font-normal text-muted-foreground">
                연구부장 전용 통합 방 개설
              </p>
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

    if (currentView === 'admin-dashboard') {
      const fullAdminUrl = `${baseUrl}/shared-time-table/admin/${activeWorkspace?.adminCode}`;

      return (
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-4xl px-4 py-6">
            {renderHeader('공용시간표 관리자 대시보드', 'home')}

            <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
                <Heading3 className="mb-1 text-red-600 dark:text-red-400">
                  🛠️ 관리자 전용 링크
                </Heading3>
                <p className="mb-2 text-xs text-red-600/80 dark:text-red-400/80">
                  이 링크를 꼭 북마크해 주세요! 절대 다른 사람에게 공유하면 안
                  됩니다.
                </p>
                <p className="mb-4 break-all rounded bg-white/50 p-2 text-xs font-mono text-red-900 dark:bg-black/50 dark:text-red-200">
                  {fullAdminUrl}
                </p>
                <Button
                  variant="red"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() =>
                    handleCopy(
                      fullAdminUrl,
                      '관리자 링크가 복사되었습니다! 메모장에 붙여넣기(Ctrl+V) 해보세요.',
                    )
                  }
                >
                  <Copy className="h-4 w-4" /> 관리자 링크 복사
                </Button>
              </div>
              <div className="rounded-2xl border border-primary-200 bg-primary/5 p-6 dark:border-primary-900/50">
                <Heading3 className="mb-1 text-primary">
                  👀 선생님 공유용 링크
                </Heading3>
                <p className="mb-2 text-xs text-muted-foreground">
                  선생님들께 공유할 읽기 전용 링크입니다. 이 방의 모든 시간표를
                  볼 수 있습니다.
                </p>
                <p className="mb-4 text-center text-3xl font-bold tracking-widest text-primary">
                  {activeWorkspace?.viewCode}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() =>
                    handleCopy(
                      activeWorkspace?.viewCode || '',
                      '참여 코드가 복사되었습니다! 선생님들께 메신저로 전달해보세요.',
                    )
                  }
                >
                  <Share2 className="h-4 w-4" /> 참여코드 복사
                </Button>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <Heading2>내 시간표 목록</Heading2>
              <Button
                onClick={() => {
                  setActiveTimetable(null);
                  setCurrentView('admin-grid');
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
                          기간: {tt.startDate} ~ {tt.endDate}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="primary-outline"
                      onClick={() => {
                        setActiveTimetable(tt);
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

    if (currentView === 'admin-grid') {
      return (
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-5xl px-4 py-6">
            {renderHeader(
              activeTimetable ? '시간표 편집' : '새 시간표 만들기',
              'admin-dashboard',
            )}

            <div className="space-y-2">
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

                    setAllEvents((prevEvents) =>
                      prevEvents.map((ev) =>
                        ev.timetableId === updated.id
                          ? {
                              ...ev,
                              startDate: updated.startDate,
                              endDate: updated.endDate,
                            }
                          : ev,
                      ),
                    );
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

              {activeTimetable && (
                <TimetableGrid
                  timetables={timetables}
                  activeTimetable={activeTimetable}
                  allEvents={allEvents}
                  onEventsChange={setAllEvents}
                  onTabChange={(tt) => setActiveTimetable(tt)}
                  onSave={handleSaveToDB}
                />
              )}
            </div>
          </div>
        </div>
      );
    }

    if (currentView === 'view') {
      return (
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-4xl px-4 py-6">
            {renderHeader('우리 반 시간표 조회', 'home')}
            <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
              여기에 참여 코드를 입력하고 들어온 교사용 읽기 전용(Read-only)
              뷰가 들어갈 예정입니다.
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <ToastProvider duration={3000}>
      {renderContent()}

      <Toast open={isToastOpen} onOpenChange={setIsToastOpen} variant="success">
        <div className="grid gap-1">
          <ToastTitle>저장 완료</ToastTitle>
          <ToastDescription>
            시간표가 성공적으로 DB에 저장되었습니다.
          </ToastDescription>
        </div>
        <ToastClose />
      </Toast>

      <ToastViewport />
    </ToastProvider>
  );
}
