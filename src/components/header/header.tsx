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
import TeacherCanIcon from '@/assets/icons/TeacehrCanIcon';
import { useSetNavState } from '@/store/use-nav-store';
import { compact, head } from 'lodash';
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
    icon: <QrCodeIcon size="14px" />,
  },
  'random-pick': {
    name: '랜덤뽑기',
    url: '/random-pick',
    icon: <DicesIcon size="14px" />,
  },
  'music-request': {
    name: '음악신청',
    url: '/music-request',
    icon: <MusicIcon size="14px" />,
  },
  feedback: {
    name: '피드백',
    url: '/feedback',
    icon: <MessageCircleHeartIcon size="14px" />,
  },
  'notice-suggestion': {
    name: '알림장 문구 추천',
    url: '/notice-suggestion',
    icon: <WandSparklesIcon size="14px" />,
  },
  setting: {
    name: '설정',
    url: '/setting',
    icon: <SettingsIcon size="14px" />,
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
    <header className="flex justify-start items-center gap-2 px-4 py-3 fixed w-full bg-background z-10">
      {showSidebarIcon ? (
        <ChevronsRight
          color="#3e3e3e"
          size="20px"
          onClick={handleClickSidebarIcon}
          className="cursor-pointer"
        />
      ) : null}

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {pathname === '/' ? (
              <BreadcrumbPage className="flex items-center gap-2">
                <TeacherCanIcon width={14} height={14} />
                티처캔
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <div className="flex items-center gap-2">
                  <TeacherCanIcon width={14} height={14} />
                  <Link href="/">티처캔</Link>
                </div>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {pathname !== '/' && <BreadcrumbSeparator>/</BreadcrumbSeparator>}

          {breadcrumb !== undefined ? (
            <BreadcrumbPage className="flex items-center gap-2">
              {breadcrumb.icon}
              {breadcrumb.name}
            </BreadcrumbPage>
          ) : null}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
