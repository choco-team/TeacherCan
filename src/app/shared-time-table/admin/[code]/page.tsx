'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Copy,
  Share2,
  Plus,
  TableProperties,
  Loader2,
  Edit2,
  Check,
  Trash2,
  X,
} from 'lucide-react';

import SetupPage from '@/containers/shared-time-table/setup-page';
import TimetableGrid, {
  RoomInfo,
  ScheduleEvent,
} from '@/containers/shared-time-table/time-table-grid';
import { Heading2, Heading3, Heading4 } from '@/components/heading';
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

type ViewState = 'admin-dashboard' | 'admin-grid';

export default function AdminWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const adminCode = params.code as string;

  const [currentView, setCurrentView] = useState<ViewState>('admin-dashboard');
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [viewCode, setViewCode] = useState<string>('');

  const [workspaceName, setWorkspaceName] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const [timetables, setTimetables] = useState<RoomInfo[]>([]);
  const [activeTimetable, setActiveTimetable] = useState<RoomInfo | null>(null);
  const [allEvents, setAllEvents] = useState<ScheduleEvent[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(window.location.origin);

    const fetchWorkspaceData = async () => {
      try {
        const { data: workspace, error: wsError } = await supabase
          .from('workspaces')
          .select('*')
          .eq('admin_code', adminCode)
          .single();

        if (wsError || !workspace) {
          // eslint-disable-next-line no-alert
          alert('존재하지 않거나 권한이 없는 관리자 링크입니다.');
          router.push('/shared-time-table');
          return;
        }

        setWorkspaceId(workspace.id);
        setViewCode(workspace.view_code);
        setWorkspaceName(workspace.name || '새 공용시간표 방');

        const { data: ttData } = await supabase
          .from('timetables')
          .select('*')
          .eq('workspace_id', workspace.id);

        if (ttData) {
          const loadedTimetables: RoomInfo[] = ttData.map((tt) => ({
            id: tt.id,
            roomName: tt.room_name,
            classes: tt.classes,
            location: tt.location,
            startDate: tt.start_date,
            endDate: tt.end_date,
          }));
          setTimetables(loadedTimetables);

          const { data: evData } = await supabase
            .from('schedule_events')
            .select('*')
            .in(
              'timetable_id',
              ttData.map((t) => t.id),
            );
          if (evData) {
            setAllEvents(
              evData.map((ev) => ({
                id: ev.id,
                timetableId: ev.timetable_id,
                day: ev.day,
                period: ev.period,
                className: ev.class_name,
                location: ev.location,
                startDate: ev.start_date,
                endDate: ev.end_date,
              })),
            );
          }
        }
      } catch (error) {
        console.error('데이터 로딩 에러:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (adminCode) fetchWorkspaceData();
  }, [adminCode, router]);

  const handleUpdateName = async () => {
    if (!tempName.trim() || tempName === workspaceName || !workspaceId) {
      setIsEditingName(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('workspaces')
        .update({ name: tempName })
        .eq('id', workspaceId);
      if (error) throw error;

      setWorkspaceName(tempName);
      setIsEditingName(false);

      const saved = localStorage.getItem('teachercan_recent_workspaces');
      if (saved) {
        const workspaces = JSON.parse(saved).map((ws: any) =>
          ws.adminCode === adminCode ? { ...ws, name: tempName } : ws,
        );
        localStorage.setItem(
          'teachercan_recent_workspaces',
          JSON.stringify(workspaces),
        );
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('이름 변경에 실패했습니다.');
    }
  };

  const handleDeleteWorkspace = async () => {
    // eslint-disable-next-line no-alert
    const confirmDelete = window.confirm(
      '정말로 이 공용시간표 방을 삭제하시겠습니까?\n이 방에 포함된 모든 시간표 데이터가 영구적으로 삭제되며 복구할 수 없습니다.',
    );

    if (!confirmDelete || !workspaceId) return;

    try {
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', workspaceId);
      if (error) throw error;

      const saved = localStorage.getItem('teachercan_recent_workspaces');
      if (saved) {
        const workspaces = JSON.parse(saved).filter(
          (ws: any) => ws.adminCode !== adminCode,
        );
        localStorage.setItem(
          'teachercan_recent_workspaces',
          JSON.stringify(workspaces),
        );
      }

      // eslint-disable-next-line no-alert
      alert('시간표 방이 성공적으로 삭제되었습니다.');
      router.push('/shared-time-table');
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('방 삭제에 실패했습니다.');
    }
  };

  // 💡 개별 시간표 삭제 기능 추가!
  const handleDeleteTimetable = async (
    timetableId: string,
    roomName: string,
  ) => {
    // eslint-disable-next-line no-alert
    const confirmDelete = window.confirm(
      `'${roomName}' 시간표를 정말 삭제하시겠습니까?\n삭제된 시간표 데이터는 복구할 수 없습니다.`,
    );

    if (!confirmDelete) return;

    try {
      // 1. 해당 시간표에 속한 수업 일정(events) 먼저 삭제 (외래키 충돌 방지)
      const { error: eventsError } = await supabase
        .from('schedule_events')
        .delete()
        .eq('timetable_id', timetableId);
      if (eventsError) throw eventsError;

      // 2. 시간표(timetable) 자체 삭제
      const { error: timetableError } = await supabase
        .from('timetables')
        .delete()
        .eq('id', timetableId);
      if (timetableError) throw timetableError;

      // 3. DB 삭제 성공 시, 화면(상태)에서도 즉시 제거
      setTimetables((prev) => prev.filter((t) => t.id !== timetableId));
      setAllEvents((prev) =>
        prev.filter((ev) => ev.timetableId !== timetableId),
      );
    } catch (error) {
      console.error('시간표 삭제 에러:', error);
      // eslint-disable-next-line no-alert
      alert('시간표 삭제에 실패했습니다.');
    }
  };

  const handleCopy = (text: string, successMessage: string) => {
    navigator.clipboard
      .writeText(text)
      // eslint-disable-next-line no-alert
      .then(() => alert(successMessage))
      // eslint-disable-next-line no-alert
      .catch(() => alert('복사에 실패했습니다.'));
  };

  const handleSaveToDB = async () => {
    if (!activeTimetable || !workspaceId) return;
    try {
      const { error: ttError } = await supabase.from('timetables').upsert({
        id: activeTimetable.id,
        workspace_id: workspaceId,
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
      // eslint-disable-next-line no-alert
      alert('저장에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            학교의 시간표 데이터를 불러오는 중입니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider duration={3000}>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="mb-6 flex items-center gap-3">
            <Button
              onClick={() => {
                if (currentView === 'admin-grid')
                  setCurrentView('admin-dashboard');
                else router.push('/shared-time-table');
              }}
              variant="gray-ghost"
              size="icon"
              className="rounded-full shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            {currentView === 'admin-dashboard' ? (
              <div className="flex-1 flex items-center gap-3">
                {isEditingName ? (
                  <div className="flex items-center gap-2 w-full max-w-md">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full border-b-2 border-primary bg-transparent text-2xl font-bold outline-none focus:border-primary-600 pb-1"
                      placeholder="방 이름을 입력하세요"
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleUpdateName}
                      className="shrink-0 gap-1 h-8"
                    >
                      <Check className="h-4 w-4" /> 저장
                    </Button>
                    <Button
                      variant="gray-outline"
                      size="sm"
                      onClick={() => setIsEditingName(false)}
                      className="shrink-0 gap-1 h-8"
                    >
                      <X className="h-4 w-4" /> 취소
                    </Button>
                  </div>
                ) : (
                  <>
                    <Heading2 className="truncate">{workspaceName}</Heading2>
                    <Button
                      variant="gray-outline"
                      size="sm"
                      className="shrink-0 gap-1.5 h-8 text-xs font-normal"
                      onClick={() => {
                        setTempName(workspaceName);
                        setIsEditingName(true);
                      }}
                    >
                      <Edit2 className="h-3 w-3" /> 이름 수정
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <Heading2 className="flex-1">
                {activeTimetable ? '시간표 편집' : '새 시간표 만들기'}
              </Heading2>
            )}
          </div>

          {currentView === 'admin-dashboard' && (
            <>
              {/* 링크 카드 영역 */}
              <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
                  <Heading3 className="mb-1 text-red-600 dark:text-red-400">
                    🛠️ 관리자 전용 링크
                  </Heading3>
                  <p className="mb-2 text-xs text-red-600/80 dark:text-red-400/80">
                    이 링크를 꼭 북마크해 주세요! 절대 다른 사람에게 공유하면 안
                    됩니다.
                  </p>
                  <p className="mb-4 break-all rounded bg-white/50 p-2 text-xs font-mono text-red-900 dark:bg-black/50 dark:text-red-200">{`${baseUrl}/shared-time-table/admin/${adminCode}`}</p>
                  <Button
                    variant="red"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() =>
                      handleCopy(
                        `${baseUrl}/shared-time-table/admin/${adminCode}`,
                        '관리자 링크 복사 완료!',
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
                    선생님들께 공유할 읽기 전용 링크입니다. 이 방의 모든
                    시간표를 볼 수 있습니다.
                  </p>
                  <p className="mb-4 text-center text-3xl font-bold tracking-widest text-primary">
                    {viewCode}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => handleCopy(viewCode, '참여 코드 복사 완료!')}
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
                <div className="grid gap-3 mb-16">
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

                      {/* 💡 편집하기 버튼 옆에 개별 삭제(휴지통) 버튼 추가! */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="primary-outline"
                          onClick={() => {
                            setActiveTimetable(tt);
                            setCurrentView('admin-grid');
                          }}
                        >
                          편집하기
                        </Button>
                        <Button
                          variant="gray-outline"
                          size="icon"
                          onClick={() =>
                            handleDeleteTimetable(tt.id, tt.roomName)
                          }
                          className="text-red-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="시간표 삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 방 전체 삭제 버튼 */}
              <div className="mt-16 rounded-2xl border border-red-200/60 bg-red-50/30 p-6 dark:border-red-900/30 dark:bg-red-950/10">
                <Heading3 className="mb-2 text-red-600 dark:text-red-400">
                  위험 구역 (Danger Zone)
                </Heading3>
                <p className="mb-4 text-sm text-muted-foreground">
                  이 공용시간표 방을 완전히 삭제합니다. 삭제된 데이터는 복구할
                  수 없습니다.
                </p>
                <Button
                  variant="primary-outline"
                  size="sm"
                  onClick={handleDeleteWorkspace}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" /> 시간표 방 영구 삭제
                </Button>
              </div>
            </>
          )}

          {currentView === 'admin-grid' && (
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
                  onTabChange={setActiveTimetable}
                  onSave={handleSaveToDB}
                />
              )}
            </div>
          )}
        </div>
      </div>

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
