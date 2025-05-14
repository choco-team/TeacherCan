import { toZonedTime } from 'date-fns-tz';
import carnation from '@/assets/images/event/carnation.png';

const EVENT_DATES = {
  '0515': {
    name: '스승의 날',
    value: 'teachersDay',
    icon: carnation,
    greeting: '선생님, 감사합니다.',
  },
} as const;

export const getDateEvent = (
  date = toZonedTime(new Date(), 'Asia/Seoul'),
): (typeof EVENT_DATES)[keyof typeof EVENT_DATES] | undefined => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return EVENT_DATES[`${month}${day}`];
};
