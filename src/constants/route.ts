import {
  LucideProps,
  MusicIcon,
  MessageCircleHeartIcon,
  DicesIcon,
  SettingsIcon,
  QrCodeIcon,
  Users,
  Hourglass,
  DatabaseIcon,
  TimerIcon,
  WandSparklesIcon,
  MegaphoneIcon,
  CircleDotIcon,
  SplitIcon,
  ClockIcon,
  WatchIcon,
  GroupIcon,
  FileTextIcon,
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export const MENU_ROUTE = {
  LANDING: '/',
  NOTICE: '/notice',
  NOTICE_SUGGESTION: '/notice-suggestion',
  QR_CODE: '/qr-code',
  CLOCK: '/clock',
  TIMER: '/timer',
  STOPWATCH_SOLO: '/stopwatch',
  STOPWATCH_GROUP: '/group-stopwatch',
  RANDOM_PICK: '/random-pick',
  MUSIC_REQUEST: '/music-request',
  ROUTINE_TIMER: '/routine-timer',
  ROULETTE: '/roulette',
  RANDOM_TEAM: '/random-team',
} as const;

export const HELP_ROUTE = {
  FEEDBACK: '/feedback',
  SETTING: '/setting',
  ANNOUNCEMENT: '/announcement',
  LEGAL: '/legal',
  PRIVACY_POLICY: '/legal/privacy-policy',
} as const;

export const DATA_ROUTE = {
  STUDENT: '/data-service/student-data',
  LOCAL_DATA: '/data-service/local-data',
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
      children?: Array<{
        title: string;
        href: string;
      }>;
    }
  >
>;

// NOTE:(김홍동) 네이게이션의 메뉴 영역과 최근 방문 페이지에서 사용되는 객체입니다.
export const MENU_PATH_DATA: PathData<MenuRoutePath> = {
  '/routine-timer': {
    title: '루틴타이머',
    Icon: Hourglass,
    href: MENU_ROUTE.ROUTINE_TIMER,
    isNew: true,
  },
  '/clock': {
    title: '시계',
    Icon: ClockIcon,
    href: MENU_ROUTE.CLOCK,
    isNew: true,
    children: [
      { title: '아날로그', href: `${MENU_ROUTE.CLOCK}/analog` },
      { title: '디지털', href: `${MENU_ROUTE.CLOCK}/digital` },
    ],
  },
  '/stopwatch': {
    title: '스톱워치',
    Icon: WatchIcon,
    href: MENU_ROUTE.STOPWATCH_SOLO,
  },
  '/group-stopwatch': {
    title: '그룹 스톱워치',
    Icon: GroupIcon,
    href: MENU_ROUTE.STOPWATCH_GROUP,
  },
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
  '/random-team': {
    title: '랜덤 모둠 뽑기',
    Icon: SplitIcon,
    href: MENU_ROUTE.RANDOM_TEAM,
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
  '/legal': {
    title: '약관/정책',
    Icon: FileTextIcon,
    href: HELP_ROUTE.LEGAL,
  },
};

export const DATA_PATH_DATA: PathData<DataRoutePath> = {
  '/data-service/student-data': {
    title: '학생 데이터 관리',
    Icon: Users,
    href: DATA_ROUTE.STUDENT,
  },
  '/data-service/local-data': {
    title: '로컬 데이터 관리',
    Icon: DatabaseIcon,
    href: DATA_ROUTE.LOCAL_DATA,
  },
};

/**
 * 저장된 pathname(최근 방문 등)을 사용자용 제목으로 변환.
 * 메뉴/데이터/도움말 경로와 시계 하위(아날로그·디지털)를 모두 처리.
 */
export function getPathDisplayTitle(path: string): string {
  if (!path || typeof path !== 'string') return '(알 수 없음)';
  const p = path.trim();
  const menu = MENU_PATH_DATA[p as MenuRoutePath];
  if (menu?.title) return menu.title;
  const childMatch = Object.values(MENU_PATH_DATA).find(
    (entry) => entry?.children?.find((c) => c.href === p) != null,
  );
  const child = childMatch?.children?.find((c) => c.href === p);
  if (child?.title) return child.title;
  const data = DATA_PATH_DATA[p as DataRoutePath];
  if (data?.title) return data.title;
  const help = HELP_PATH_DATA[p as HelpRoutePath];
  if (help?.title) return help.title;
  return p || '(알 수 없음)';
}
