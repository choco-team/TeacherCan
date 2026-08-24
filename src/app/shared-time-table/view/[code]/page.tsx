'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  SearchX,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';

import {
  RoomInfo,
  ScheduleEvent,
} from '@/containers/shared-time-table/time-table-grid';
import { Heading2, Heading3 } from '@/components/heading';
import { Button } from '@/components/button';
import { supabase } from '@/lib/supabase';

const DAYS = ['월', '화', '수', '목', '금'];
const PERIODS = [1, 2, 3, 4, 5, 6];

// 날짜 계산을 위한 도우미 함수들
const getMonday = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const addDays = (d: Date, days: number) => {
  const date = new Date(d);
  date.setDate(date.getDate() + days);
  return date;
};

const formatDateStr = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function SharedTimeTableViewerPage() {
  const params = useParams();
  const router = useRouter();
  const viewCode = (params.code as string).toUpperCase();

  const [workspaceName, setWorkspaceName] = useState<string>('');
  const [timetables, setTimetables] = useState<RoomInfo[]>([]);
  const [allEvents, setAllEvents] = useState<ScheduleEvent[]>([]);

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getMonday(new Date()),
  );

  const weekDates = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) =>
      addDays(currentWeekStart, i),
    );
  }, [currentWeekStart]);

  useEffect(() => {
    const fetchViewerData = async () => {
      try {
        const { data: workspace, error: wsError } = await supabase
          .from('workspaces')
          .select('*')
          .eq('view_code', viewCode)
          .single();

        if (wsError || !workspace) {
          // eslint-disable-next-line no-alert
          alert('존재하지 않거나 잘못된 참여 코드입니다.');
          router.push('/shared-time-table');
          return;
        }

        setWorkspaceName(workspace.name || '공용시간표');

        const { data: ttData } = await supabase
          .from('timetables')
          .select('*')
          .eq('workspace_id', workspace.id)
          .order('created_at', { ascending: true });

        if (ttData && ttData.length > 0) {
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
            const loadedEvents = evData.map((ev) => ({
              id: ev.id,
              timetableId: ev.timetable_id,
              day: ev.day,
              period: ev.period,
              className: ev.class_name,
              location: ev.location,
              startDate: ev.start_date,
              endDate: ev.end_date,
            }));
            setAllEvents(loadedEvents);

            const classes = Array.from(
              new Set(loadedEvents.map((ev) => ev.className)),
            ).filter(Boolean);
            classes.sort((a, b) =>
              a.localeCompare(b, undefined, { numeric: true }),
            );
            if (classes.length > 0) {
              setSelectedClass(classes[0]);
            }
          }
        }
      } catch (error) {
        console.error('시간표 로딩 에러:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (viewCode) fetchViewerData();
  }, [viewCode, router]);

  const availableClasses = useMemo(() => {
    const classes = Array.from(
      new Set(allEvents.map((ev) => ev.className)),
    ).filter(Boolean);
    return classes.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true }),
    );
  }, [allEvents]);

  const getEventForClass = (dayIndex: number, period: number) => {
    const targetDateStr = formatDateStr(weekDates[dayIndex]);
    const dayName = DAYS[dayIndex];

    const events = allEvents.filter(
      (ev) =>
        ev.className === selectedClass &&
        ev.day === dayName &&
        ev.period === period,
    );

    // 💡 1번 에러(no-restricted-syntax) 해결: for루프 대신 .find() 함수 사용
    const validEvent = events.find((ev) => {
      const parentTimetable = timetables.find((t) => t.id === ev.timetableId);
      return (
        parentTimetable &&
        parentTimetable.startDate <= targetDateStr &&
        targetDateStr <= parentTimetable.endDate
      );
    });

    if (validEvent) {
      const parentTimetable = timetables.find(
        (t) => t.id === validEvent.timetableId,
      );
      return {
        ...validEvent,
        roomName: parentTimetable?.roomName || '',
        roomLocation: parentTimetable?.location || validEvent.location || '',
      };
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            시간표 데이터를 불러오는 중입니다...
          </p>
        </div>
      </div>
    );
  }

  // 💡 2번 에러(no-nested-ternary) 해결: 복잡했던 삼항 연산자를 깔끔한 렌더링 함수로 분리
  const renderContent = () => {
    if (timetables.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <SearchX className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <Heading3 className="mb-2 text-muted-foreground">
            등록된 시간표가 없습니다
          </Heading3>
          <p className="text-sm text-muted-foreground">
            관리자가 아직 시간표를 작성하지 않았습니다.
          </p>
        </div>
      );
    }

    if (availableClasses.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <Heading3 className="mb-2 text-muted-foreground">
            배정된 학급이 없습니다
          </Heading3>
          <p className="text-sm text-muted-foreground">
            시간표에 등록된 반이 없습니다.
          </p>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1 shadow-sm">
            <Button
              variant="gray-ghost"
              size="icon"
              onClick={() => setCurrentWeekStart((prev) => addDays(prev, -7))}
              className="h-8 w-8 rounded-full shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 px-2 text-sm font-semibold">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span>
                {weekDates[0].getMonth() + 1}월 {weekDates[0].getDate()}일 ~{' '}
                {weekDates[4].getMonth() + 1}월 {weekDates[4].getDate()}일
              </span>
            </div>
            <Button
              variant="gray-ghost"
              size="icon"
              onClick={() => setCurrentWeekStart((prev) => addDays(prev, 7))}
              className="h-8 w-8 rounded-full shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="gray-outline"
            size="sm"
            onClick={() => setCurrentWeekStart(getMonday(new Date()))}
            className="rounded-full"
          >
            이번 주
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-center text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="w-16 p-3 font-semibold text-muted-foreground border-r border-border align-middle">
                  교시
                </th>
                {weekDates.map((date, i) => {
                  const isToday =
                    formatDateStr(date) === formatDateStr(new Date());
                  // 💡 3번 에러(no-array-index-key) 해결: 날짜 문자열(예: '2026-08-26')을 Key로 사용
                  return (
                    <th
                      key={formatDateStr(date)}
                      className={`p-2 font-semibold ${isToday ? 'text-primary' : 'text-foreground'} w-1/5`}
                    >
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        <span className="text-xs opacity-70">
                          {date.getMonth() + 1}.{date.getDate()}
                        </span>
                        <span className="text-sm">({DAYS[i]})</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PERIODS.map((period) => (
                <tr key={period} className="divide-x divide-border">
                  <td className="bg-muted/20 p-3 font-medium text-muted-foreground">
                    {period}
                  </td>
                  {weekDates.map((date, dayIndex) => {
                    const event = getEventForClass(dayIndex, period);
                    const isToday =
                      formatDateStr(date) === formatDateStr(new Date());

                    // 💡 4번 에러(no-array-index-key) 해결: 날짜+교시 조합을 고유 Key로 사용
                    return (
                      <td
                        key={`${formatDateStr(date)}-${period}`}
                        className={`h-24 p-2 align-middle ${isToday ? 'bg-primary/5' : ''}`}
                      >
                        {event ? (
                          <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-emerald-500/10 p-2 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 transition-colors hover:bg-emerald-500/20">
                            <span className="font-bold text-base md:text-lg">
                              {event.roomName}
                            </span>
                            {event.roomLocation && (
                              <span className="mt-1 text-xs opacity-80 line-clamp-1">
                                {event.roomLocation}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* 상단 헤더 영역 */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push('/shared-time-table')}
              variant="gray-ghost"
              size="icon"
              className="rounded-full shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <Heading2>{workspaceName}</Heading2>
              <p className="text-xs text-muted-foreground mt-1">
                우리 반 시간표 조회
              </p>
            </div>
          </div>

          {availableClasses.length > 0 && (
            <div className="flex items-center gap-3 rounded-lg bg-muted/30 px-4 py-2 border border-border">
              <label
                htmlFor="class-select"
                className="text-sm font-medium text-muted-foreground whitespace-nowrap"
              >
                학급 선택
              </label>
              <select
                id="class-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="h-9 min-w-[120px] cursor-pointer rounded-md border border-input bg-background px-3 py-1 text-sm font-semibold text-foreground outline-none ring-offset-background focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 💡 복잡했던 렌더링 부분을 함수 하나로 깔끔하게 호출 */}
        {renderContent()}
      </div>
    </div>
  );
}
