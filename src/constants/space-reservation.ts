import {
  SPACE_RESERVATION_PERIODS,
  SpaceReservationWeekday,
} from '@/types/space-reservation';

export const SPACE_RESERVATION_GRADE_OPTIONS = Array.from(
  { length: 6 },
  (_, index) => String(index + 1),
);

export const SPACE_RESERVATION_CLASS_OPTIONS = Array.from(
  { length: 20 },
  (_, index) => String(index + 1),
);

export const SPACE_RESERVATION_PERIOD_ROWS: Array<{
  label: string;
  period: (typeof SPACE_RESERVATION_PERIODS)[number];
}> = SPACE_RESERVATION_PERIODS.map((period) => ({
  label: `${period}교시`,
  period,
}));

export const SPACE_RESERVATION_WEEKDAY_LABEL: Record<
  SpaceReservationWeekday,
  string
> = {
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
};

export const SPACE_RESERVATION_GENERIC_ERROR = '잠시 후 다시 시도해 주세요.';
