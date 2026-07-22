'use client';

import { X, MapPin, Layers, CheckCircle } from 'lucide-react';
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
  // 💡 부모로부터 전체 이벤트 데이터와 수정 함수를 내려받습니다!
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
  // ❌ const [allEvents, setAllEvents] = useState<ScheduleEvent[]>([]); (삭제됨)

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

    // 💡 부모의 데이터를 업데이트합니다.
    onEventsChange([...allEvents, newEvent]);
  };

  const handleDeleteEvent = (eventId: string) => {
    // 💡 부모의 데이터를 업데이트합니다.
    onEventsChange(allEvents.filter((ev) => ev.id !== eventId));
  };

  return (
    <div className="relative animate-in fade-in slide-in-from-top-4 duration-500 mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
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

      <div className="mb-4 flex items-center justify-between">
        <div>
          <Heading3 className="text-primary">
            {activeTimetable.roomName} 배정
          </Heading3>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            기간: {activeTimetable.startDate} ~ {activeTimetable.endDate}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          원하는 시간의 <b>[+ 반 선택]</b>을 눌러 배정하세요.
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
                  const cellEvents = allEvents.filter((e) => {
                    if (e.day !== day || e.period !== period) return false;
                    if (e.timetableId === activeTimetable.id) return true;
                    return (
                      e.startDate <= activeTimetable.endDate &&
                      e.endDate >= activeTimetable.startDate
                    );
                  });

                  return (
                    <TableCell
                      key={`${day}_${period}`}
                      className="min-h-[90px] w-[calc(100%/5)] border-r border-border p-2 align-top last:border-r-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex flex-col gap-1.5 h-full">
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
