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
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { compact, head } from 'lodash';
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
};

export default function Header() {
  const pathname = usePathname();
  const pathnames = compact(pathname.split('/'));
  const headPathname = head(pathnames);

  const { open, openMobile, setOpen, setOpenMobile, isMobile } = useSidebar();

  const showSidebarIcon = isMobile ? !openMobile : !open;
  const handleClickSidebarIcon = () => {
    if (isMobile) {
      setOpenMobile(true);

      return;
    }

    setOpen(true);
  };

  // TODO:(김홍동) header breadcrumb가 복수를 가질 수 있도록 확장하기
  const breadcrumb = breadcrumbs[headPathname];

  return (
    <header className="flex justify-start items-center gap-2 px-4 py-3 fixed w-full bg-bg z-10">
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
                  <Link className="text-text-subtitle" href="/">
                    티처캔
                  </Link>
                </div>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {pathname !== '/' && <BreadcrumbSeparator>/</BreadcrumbSeparator>}

          {breadcrumb !== undefined ? (
            <BreadcrumbPage className="flex items-center gap-2 text-text-title">
              {breadcrumb.icon}
              {breadcrumb.name}
            </BreadcrumbPage>
          ) : null}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
