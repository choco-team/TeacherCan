'use client';

import { useState } from 'react';
import { X, Calendar as CalendarIcon, MapPin, Layers } from 'lucide-react';
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

export interface RoomInfo {
  id: string;
  roomName: string;
  classes: string[];
  location: string;
  startDate: string;
  endDate: string;
}

const DAYS = ['월', '화', '수', '목', '금'];
const PERIODS = [1, 2, 3, 4, 5, 6];

export interface ScheduleEvent {
  id: string;
  timetableId: string;
  day: string;
  period: number;
  className: string;
  // 💡 장소와 날짜는 폼에서 정한 걸 그대로 끌고 옴!
  location: string;
  startDate: string;
  endDate: string;
}

interface TimetableGridProps {
  timetables: RoomInfo[];
  activeTimetable: RoomInfo;
  onTabChange: (timetable: RoomInfo) => void;
}

export default function TimetableGrid({
  timetables,
  activeTimetable,
  onTabChange,
}: TimetableGridProps) {
  const [allEvents, setAllEvents] = useState<ScheduleEvent[]>([]);

  // 💡 모달 없이 셀 안의 드롭다운에서 반을 선택하면 즉시 추가됨!
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
      location: activeTimetable.location, // 폼에서 입력한 공통 장소 삽입
      startDate: activeTimetable.startDate, // 공통 시작일 삽입
      endDate: activeTimetable.endDate, // 공통 종료일 삽입
    };

    setAllEvents([...allEvents, newEvent]);
  };

  const handleDeleteEvent = (eventId: string) => {
    setAllEvents(allEvents.filter((ev) => ev.id !== eventId));
  };

  return (
    <div className="relative animate-in fade-in slide-in-from-top-4 duration-500 mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
      {/* 탭 영역 */}
      <div className="mb-6 border-b border-border pb-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Layers className="h-4 w-4" />
          <span>편집할 시간표 탭 선택 (다른 시간표는 배경에 표시됩니다)</span>
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

      <div className="mb-4 flex items-center justify-between">
        <Heading3 className="text-primary">
          {activeTimetable.roomName} 배정
        </Heading3>
        <p className="text-sm text-muted-foreground">
          원하는 시간의 <b>[+ 반 선택]</b>을 눌러 학급을 빠르게 배정하세요.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-900">
            <TableRow>
              <TableHead className="w-16 border-r border-border text-center font-semibold text-muted-foreground">
                교시
              </TableHead>
              {DAYS.map((day) => (
                <TableHead
                  key={day}
                  className="border-r border-border text-center font-semibold text-text-title last:border-r-0"
                >
                  {day}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {PERIODS.map((period) => (
              <TableRow key={period}>
                <TableCell className="border-r border-border bg-gray-50 dark:bg-gray-900 text-center font-semibold text-muted-foreground">
                  {period}
                </TableCell>
                {DAYS.map((day) => {
                  const cellEvents = allEvents.filter(
                    (e) => e.day === day && e.period === period,
                  );

                  return (
                    <TableCell
                      key={`${day}_${period}`}
                      className="min-h-[100px] w-[calc(100%/5)] border-r border-border p-2 align-top last:border-r-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex flex-col gap-1.5 h-full">
                        {/* 1. 배치된 카드들 렌더링 */}
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
                                  ? 'border-primary/30 bg-primary/10 hover:border-primary/50'
                                  : 'border-gray-200 bg-gray-100/50 dark:border-gray-800 dark:bg-gray-900/50 opacity-60'
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
                              <div className="flex items-center justify-between mb-1">
                                <span
                                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                    isActive
                                      ? 'bg-primary/20 text-primary-700 dark:text-primary-300'
                                      : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                  }`}
                                >
                                  {ev.className}
                                </span>
                                <span
                                  className={`text-[11px] font-semibold truncate ml-1 ${
                                    isActive
                                      ? 'text-text-title'
                                      : 'text-muted-foreground'
                                  }`}
                                >
                                  {parentTimetable?.roomName}
                                </span>
                              </div>
                              {/* 💡 장소와 기간이 카드에 예쁘게 표시됩니다! */}
                              <div className="text-[10px] text-muted-foreground flex items-center gap-1 mb-0.5">
                                <MapPin className="h-3 w-3 shrink-0" />
                                <span className="truncate">
                                  {ev.location || '장소 미지정'}
                                </span>
                              </div>
                              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3 shrink-0" />
                                <span className="truncate">
                                  {ev.startDate.slice(5)}~{ev.endDate.slice(5)}
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {/* 2. 💡 초스피드 배정 드롭다운 (현재 편집 중인 탭 전용) */}
                        <div className="mt-auto pt-1">
                          <select
                            value=""
                            onChange={(e) =>
                              handleQuickAssign(day, period, e.target.value)
                            }
                            className="w-full cursor-pointer rounded border border-dashed border-primary/50 bg-transparent py-1 text-center text-[11px] font-medium text-primary outline-none transition-colors hover:bg-primary/5"
                          >
                            <option value="" disabled>
                              + 반 배정
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
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
