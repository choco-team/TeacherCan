'use client';

import React, { ReactNode } from 'react';
import {
  WandSparklesIcon,
  ChevronsRight,
  MessageCircleHeartIcon,
  MusicIcon,
  DicesIcon,
  QrCodeIcon,
  SettingsIcon,
  MegaphoneIcon,
  CircleDotIcon,
  Users,
  Timer,
  SplitIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { compact } from 'lodash';
import EventIcon from '@/components/event-icon';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../breadcrumb';
import { useSidebar } from '../sidebar';

const breadcrumbs: Record<
  string,
  { name: string; url: string; icon: ReactNode }
> = {
  'qr-code': {
    name: 'QR코드',
    url: '/qr-code',
    icon: <QrCodeIcon size="1rem" />,
  },
  'random-pick': {
    name: '랜덤뽑기',
    url: '/random-pick',
    icon: <DicesIcon size="1rem" />,
  },
  'music-request': {
    name: '음악신청',
    url: '/music-request',
    icon: <MusicIcon size="1rem" />,
  },
  feedback: {
    name: '피드백',
    url: '/feedback',
    icon: <MessageCircleHeartIcon size="1rem" />,
  },
  'notice-suggestion': {
    name: '알림장 문구 추천',
    url: '/notice-suggestion',
    icon: <WandSparklesIcon size="1rem" />,
  },
  setting: {
    name: '설정',
    url: '/setting',
    icon: <SettingsIcon size="1rem" />,
  },
  announcement: {
    name: '공지사항',
    url: '/announcement',
    icon: <MegaphoneIcon size="1rem" />,
  },
  roulette: {
    name: '룰렛 돌리기',
    url: '/roulette',
    icon: <CircleDotIcon size="1rem" />,
  },
  'student-data': {
    name: '학생 데이터 관리',
    url: '/data-service/student-data',
    icon: <Users size="1rem" />,
  },
  'random-team': {
    name: '랜덤 모둠 뽑기',
    url: '/random-team',
    icon: <SplitIcon size="1rem" />,
  },
  stopwatch: {
    name: '스톱워치',
    url: '/stopwatch',
    icon: <Timer size="1rem" />,
  },
  'group-stopwatch': {
    name: '그룹 스톱워치',
    url: '/group-stopwatch',
    icon: <Users size="1rem" />,
  },
};

export default function Header() {
  const pathname = usePathname();
  const pathnames = compact(pathname.split('/'));

  const { open, openMobile, setOpen, setOpenMobile, isMobile } = useSidebar();

  const showSidebarIcon = isMobile ? !openMobile : !open;
  const handleClickSidebarIcon = () => {
    if (isMobile) {
      setOpenMobile(true);

      return;
    }

    setOpen(true);
  };

  const breadcrumbList = pathnames
    .map((path) => breadcrumbs[path])
    .filter((item) => item);

  return (
    <header className="flex justify-start items-center gap-2 px-4 py-3 fixed w-full bg-bg z-50">
      {showSidebarIcon ? (
        <ChevronsRight
          size="1.2rem"
          onClick={handleClickSidebarIcon}
          className="cursor-pointer text-text-subtitle"
        />
      ) : null}

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {pathname === '/' ? (
              <BreadcrumbPage className="flex items-center gap-2 text-text-title">
                <EventIcon width={16} height={16} className="size-4" />
                티처캔
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <div className="flex items-center gap-2 ">
                  <EventIcon width={16} height={16} className="size-4" />
                  <Link className="text-text-title" href="/">
                    티처캔
                  </Link>
                </div>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>

          {breadcrumbList.map((item, index) => (
            <>
              {item.url !== '/' && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
              {index === breadcrumbList.length - 1 ? (
                <BreadcrumbPage className="flex items-center gap-2 text-text-title">
                  {item.icon}
                  {item.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <div className="flex items-center gap-2 text-text-title">
                    {item.icon}
                    <Link href={item.url}>{item.name}</Link>
                  </div>
                </BreadcrumbLink>
              )}
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
