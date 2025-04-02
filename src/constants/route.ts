import {
  BellIcon,
  LucideProps,
  PickaxeIcon,
  QrCodeIcon,
  TimerIcon,
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export const ROUTE = {
  LANDING: '/',
  NOTICE: '/notice',
  NOTICE_SUGGESTION: '/notice-suggestion',
  QR_CODE: '/qr-code',
  TIMER: '/timer',
  RANDOM_PICK: '/random-pick',
  MUSIC_REQUEST: '/music-request',
} as const;

export type RoutePath = (typeof ROUTE)[keyof typeof ROUTE];

// NOTE:(김홍동) 네이게이션의 메뉴와 최근 방문 페이지에서 사용되는 객체입니다.
export const PATH_DATA: Partial<
  Record<
    RoutePath,
    {
      title: string;
      Icon: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
      >;
      href: string;
    }
  >
> = {
  '/qr-code': {
    title: 'QR코드',
    Icon: QrCodeIcon,
    href: ROUTE.QR_CODE,
  },
  '/random-pick': {
    title: '랜덤뽑기',
    Icon: PickaxeIcon,
    href: ROUTE.RANDOM_PICK,
  },
  '/timer': {
    title: '타이머',
    Icon: TimerIcon,
    href: ROUTE.TIMER,
  },
  [ROUTE.NOTICE_SUGGESTION]: {
    title: '알림장 문구 추천',
    Icon: BellIcon,
    href: ROUTE.NOTICE_SUGGESTION,
  },
  // TODO:(김홍동) 내부 테스트 후 메뉴 오픈하기
  // '/music-request': {
  //   title: '음악신청',
  //   Icon: MusicIcon,
  //   href: ROUTE.MUSIC_REQUEST,
  // },
};
