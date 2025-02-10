import { compareAsc, format } from 'date-fns';
import { ScheduleType } from '../schedules.types';

export const reshapeSchedule = (schedules: ScheduleType[]) => {
  const groupedSchedule = schedules.reduce((acc, schedule) => {
    const dateKey = format(schedule.date, 'yyyy-MM-dd');

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    acc[dateKey].push(schedule);
    return acc;
  }, {});

  const reshapedSchedule = Object.entries(groupedSchedule).sort(([a], [b]) =>
    compareAsc(a, b),
  ) as [string, ScheduleType[]][];

  return reshapedSchedule;
};

export const calculateDays = (date: Date) => {
  const today = +new Date();
  const targetDate = +new Date(date);
  const difference = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
  return difference > 0 ? `D-${difference}` : `D+${Math.abs(difference)}`;
};
