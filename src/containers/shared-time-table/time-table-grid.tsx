'use client';

import { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Layers,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/button';
import { Heading3 } from '@/components/heading';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/table';

const DAYS = ['월', '화', '수', '목', '금'];
const PERIODS = [1, 2, 3, 4, 5, 6];

const parseDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const getMonday = (dateStr: string) => {
  const date = parseDate(dateStr);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return date;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const toDateString = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const toShortString = (date: Date) => {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export interface RoomInfo {
  id: string;
  roomName: string;
  classes: string[];
  location: string;
  startDate: string;
  endDate: string;
}

export interface ScheduleEvent {
  id: string;
  timetableId: string;
  day: string;
  period: number;
  className: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface TimetableGridProps {
  timetables: RoomInfo[];
  activeTimetable: RoomInfo;
  allEvents: ScheduleEvent[];
  onEventsChange: (events: ScheduleEvent[]) => void;
  onTabChange: (timetable: RoomInfo) => void;
  onSave: () => void;
}

export default function TimetableGrid({
  timetables,
  activeTimetable,
  allEvents,
  onEventsChange,
  onTabChange,
  onSave,
}: TimetableGridProps) {
  const [currentWeekMonday, setCurrentWeekMonday] = useState(() =>
    getMonday(activeTimetable.startDate),
  );

  useEffect(() => {
    setCurrentWeekMonday(getMonday(activeTimetable.startDate));
  }, [activeTimetable.id, activeTimetable.startDate]);

  const handleQuickAssign = (
    day: string,
    period: number,
    selectedClass: string,
  ) => {
    if (!selectedClass) return;
    const newEvent: ScheduleEvent = {
      id: crypto.randomUUID(),
      timetableId: activeTimetable.id,
      day,
      period,
      className: selectedClass,
      location: activeTimetable.location,
      startDate: activeTimetable.startDate,
      endDate: activeTimetable.endDate,
    };
    onEventsChange([...allEvents, newEvent]);
  };

  const handleDeleteEvent = (eventId: string) => {
    onEventsChange(allEvents.filter((ev) => ev.id !== eventId));
  };

  return (
    <div className="relative animate-in fade-in slide-in-from-top-4 duration-500 mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
      {/* 상단 탭 영역 */}
      <div className="mb-6 border-b border-border pb-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Layers className="h-4 w-4" />
          <span>
            편집할 시간표 선택 (설정한 기간과 겹치는 다른 시간표가 배경에
            표시됩니다)
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {timetables.map((tt) => (
            <Button
              key={tt.id}
              onClick={() => onTabChange(tt)}
              variant={
                tt.id === activeTimetable.id ? 'primary' : 'gray-outline'
              }
              size="sm"
              className={`rounded-full px-5 font-semibold ${
                tt.id !== activeTimetable.id
                  ? 'opacity-70 hover:opacity-100'
                  : ''
              }`}
            >
              {tt.roomName}
            </Button>
          ))}
        </div>
      </div>

      {/* 헤더 및 주차 네비게이션 */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Heading3 className="text-primary">
            {activeTimetable.roomName} 배정
          </Heading3>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            전체 기간: {activeTimetable.startDate} ~ {activeTimetable.endDate}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 w-fit">
          <Button
            variant="gray-ghost"
            size="icon"
            onClick={() => setCurrentWeekMonday((prev) => addDays(prev, -7))}
            className="h-8 w-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-bold text-text-title min-w-[110px] text-center">
            {toShortString(currentWeekMonday)} ~{' '}
            {toShortString(addDays(currentWeekMonday, 4))}
          </div>
          <Button
            variant="gray-ghost"
            size="icon"
            onClick={() => setCurrentWeekMonday((prev) => addDays(prev, 7))}
            className="h-8 w-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-900">
            <TableRow>
              <TableHead className="w-16 border-r border-border text-center align-middle font-semibold text-muted-foreground">
                교시
              </TableHead>
              {DAYS.map((day, idx) => {
                const dateForDay = addDays(currentWeekMonday, idx);
                return (
                  <TableHead
                    key={day}
                    className="border-r border-border text-center font-semibold text-text-title last:border-r-0 py-2"
                  >
                    <div>{day}</div>
                    <div className="text-[10px] text-muted-foreground font-normal mt-0.5">
                      {toShortString(dateForDay)}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {PERIODS.map((period) => (
              <TableRow key={period}>
                <TableCell className="border-r border-border bg-gray-50 dark:bg-gray-900 text-center font-semibold text-muted-foreground">
                  {period}
                </TableCell>
                {DAYS.map((day, dayIdx) => {
                  // 정확한 날짜 추출
                  const dateForDayStr = toDateString(
                    addDays(currentWeekMonday, dayIdx),
                  );

                  // 이 칸에 들어갈 이벤트 필터링 (주차 로직 유지)
                  const cellEvents = allEvents.filter((e) => {
                    if (e.day !== day || e.period !== period) return false;
                    return (
                      dateForDayStr >= e.startDate && dateForDayStr <= e.endDate
                    );
                  });

                  // 배정 가능한 기간인지 확인
                  const isDayWithinActiveTimetable =
                    dateForDayStr >= activeTimetable.startDate &&
                    dateForDayStr <= activeTimetable.endDate;

                  return (
                    <TableCell
                      key={`${day}_${period}`}
                      className={`min-h-[100px] w-[calc(100%/5)] border-r border-border p-2 align-top last:border-r-0 transition-colors ${
                        isDayWithinActiveTimetable
                          ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          : 'bg-gray-50/30 dark:bg-gray-900/30'
                      }`}
                    >
                      <div className="flex flex-col gap-1.5 h-full">
                        {/* 💡 디자인 원상복구: 모든 이벤트를 기존의 큰 카드 형태로 통일해서 출력합니다! */}
                        {cellEvents.map((ev) => {
                          const isActive =
                            ev.timetableId === activeTimetable.id;
                          const parentTimetable = timetables.find(
                            (t) => t.id === ev.timetableId,
                          );

                          return (
                            <div
                              key={ev.id}
                              className={`group relative rounded-md border p-2 text-left transition-all ${
                                isActive
                                  ? 'border-primary/30 bg-primary/10 hover:border-primary/50' // 내가 편집 중인 시간표 (빨간 카드)
                                  : 'border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 opacity-60' // 배경에 깔리는 다른 시간표 (투명도 있는 점선 회색 카드)
                              }`}
                            >
                              {isActive && (
                                <button
                                  onClick={() => handleDeleteEvent(ev.id)}
                                  className="absolute -right-1 -top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow-sm hover:bg-red-600 group-hover:flex"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}

                              <div className="flex items-center justify-between mb-1.5">
                                <span
                                  className={`rounded px-1.5 py-0.5 text-xs font-bold ${
                                    isActive
                                      ? 'bg-primary/20 text-primary-700 dark:text-primary-300'
                                      : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                  }`}
                                >
                                  {ev.className}
                                </span>
                                <span
                                  className={`text-xs font-semibold truncate ml-1 ${
                                    isActive
                                      ? 'text-text-title'
                                      : 'text-muted-foreground'
                                  }`}
                                >
                                  {parentTimetable?.roomName}
                                </span>
                              </div>

                              {ev.location && (
                                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate leading-none">
                                    {ev.location}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* 기간 외 처리 로직 유지 */}
                        {isDayWithinActiveTimetable ? (
                          <div className="mt-auto pt-1">
                            <select
                              value=""
                              onChange={(e) =>
                                handleQuickAssign(day, period, e.target.value)
                              }
                              className="w-full cursor-pointer rounded border border-dashed border-primary/50 bg-transparent py-1 text-center text-xs font-medium text-primary outline-none transition-colors hover:bg-primary/5"
                            >
                              <option value="" disabled>
                                + 반 선택
                              </option>
                              {activeTimetable.classes.map((c) => (
                                <option
                                  key={c}
                                  value={c}
                                  className="text-text-title"
                                >
                                  {c}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="mt-auto pt-2 pb-1 text-center text-[10px] font-medium text-muted-foreground/40 bg-gray-50/50 dark:bg-gray-800/30 rounded">
                            기간 외
                          </div>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="primary"
          size="sm"
          onClick={onSave}
          className="gap-1.5 px-6"
        >
          <CheckCircle className="h-4 w-4" />
          저장
        </Button>
      </div>
    </div>
  );
}
