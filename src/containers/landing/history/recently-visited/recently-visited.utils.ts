import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';

export function getElapsedTime(date: Date): string {
  const now = new Date();

  const minutes = differenceInMinutes(now, date);
  const hours = differenceInHours(now, date);
  const days = differenceInDays(now, date);

  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  return `${days}일 전`;
}
