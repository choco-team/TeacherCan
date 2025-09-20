import {
  LucideProps,
  MusicIcon,
  MessageCircleHeartIcon,
  DicesIcon,
  SettingsIcon,
  QrCodeIcon,
  UserIcon,
  // Hourglass,
  TimerIcon,
  WandSparklesIcon,
  MegaphoneIcon,
  CircleDotIcon,
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export const MENU_ROUTE = {
  LANDING: '/',
  NOTICE: '/notice',
  NOTICE_SUGGESTION: '/notice-suggestion',
  QR_CODE: '/qr-code',
  TIMER: '/timer',
  RANDOM_PICK: '/random-pick',
  MUSIC_REQUEST: '/music-request',
  ROUTINE_TIMER: '/routine-timer',
  ROULETTE: '/roulette',
} as const;

export const HELP_ROUTE = {
  FEEDBACK: '/feedback',
  SETTING: '/setting',
  ANNOUNCEMENT: '/announcement',
} as const;

export const DATA_ROUTE = {
  STUDENT: '/data-service/student-data',
} as const;

type DataRoutePath = (typeof DATA_ROUTE)[keyof typeof DATA_ROUTE];

export type MenuRoutePath = (typeof MENU_ROUTE)[keyof typeof MENU_ROUTE];

type PathData<T extends string> = Partial<
  Record<
    T,
    {
      title: string;
      Icon: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
      >;
      href: string;
      isNew?: boolean;
    }
  >
>;

// NOTE:(김홍동) 네이게이션의 메뉴 영역과 최근 방문 페이지에서 사용되는 객체입니다.
export const MENU_PATH_DATA: PathData<MenuRoutePath> = {
  '/qr-code': {
    title: 'QR코드',
    Icon: QrCodeIcon,
    href: MENU_ROUTE.QR_CODE,
  },
  '/random-pick': {
    title: '랜덤뽑기',
    Icon: DicesIcon,
    href: MENU_ROUTE.RANDOM_PICK,
  },
  '/timer': {
    title: '타이머',
    Icon: TimerIcon,
    href: MENU_ROUTE.TIMER,
  },
  '/roulette': {
    title: '룰렛 돌리기',
    Icon: CircleDotIcon,
    href: MENU_ROUTE.ROULETTE,
    isNew: true,
  },
  '/music-request': {
    title: '음악신청',
    Icon: MusicIcon,
    href: MENU_ROUTE.MUSIC_REQUEST,
  },
  '/notice-suggestion': {
    title: '알림장 문구 추천',
    Icon: WandSparklesIcon,
    href: MENU_ROUTE.NOTICE_SUGGESTION,
  },
  // '/routine-timer': {
  //   title: '루틴타이머',
  //   Icon: Hourglass,
  //   href: MENU_ROUTE.ROUTINE_TIMER,
  // },
};

type HelpRoutePath = (typeof HELP_ROUTE)[keyof typeof HELP_ROUTE];

// NOTE:(김홍동) 네이게이션의 도움 영역에서 사용되는 객체입니다.
export const HELP_PATH_DATA: PathData<HelpRoutePath> = {
  '/announcement': {
    title: '공지사항',
    Icon: MegaphoneIcon,
    href: HELP_ROUTE.ANNOUNCEMENT,
  },
  '/feedback': {
    title: '피드백',
    Icon: MessageCircleHeartIcon,
    href: HELP_ROUTE.FEEDBACK,
  },
  '/setting': {
    title: '설정',
    Icon: SettingsIcon,
    href: HELP_ROUTE.SETTING,
  },
};

export const DATA_PATH_DATA: PathData<DataRoutePath> = {
  '/data-service/student-data': {
    title: '학생 관리',
    Icon: UserIcon,
    href: DATA_ROUTE.STUDENT,
  },
};
