'use client';

import {
  ChevronsDown,
  ChevronsRight,
  MusicIcon,
  PickaxeIcon,
  QrCodeIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';
import Link from 'next/link';
import TeacherCanIcon from '@/assets/icons/TeacehrCanIcon';
import { compact, head } from 'lodash';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../breadcrumb';

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
    icon: <PickaxeIcon size="14px" />,
  },
  'music-request': {
    name: '음악신청',
    url: '/music-request',
    icon: <MusicIcon size="14px" />,
  },
};

const shouldHideHeaderPathname = ['/timer'];

export default function Header() {
  const pathname = usePathname();
  const pathnames = compact(pathname.split('/'));
  const headPathname = head(pathnames);

  // TODO:(김홍동) header breadcrumb가 복수를 가질 수 있도록 확장하기
  const breadcrumb = breadcrumbs[headPathname];

  const handleClick = () => {
    const main = document.getElementById('teacher-can-main');
    const navigation = document.getElementById('teacher-can-nav');
    const headerIcon = document.getElementById('teacher-can-header-icon');

    main.setAttribute('data-status', 'open');
    headerIcon.setAttribute('data-status', 'open');
    navigation.setAttribute('data-status', 'open');

    navigation.classList.add('fixed');
    navigation.classList.remove('hidden');
  };

  if (shouldHideHeaderPathname.includes(pathname)) {
    return null;
  }

  return (
    <header className="flex justify-between lg:justify-start gap-2 px-4 py-3 fixed w-full bg-background z-10">
      <ChevronsRight
        color="#3e3e3e"
        id="teacher-can-header-icon"
        className="cursor-pointer self-end hidden lg:data-[status=open]:hidden lg:data-[status=closed]:block"
        onClick={handleClick}
        size="20px"
      />

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

      <ChevronsDown
        color="#3e3e3e"
        id="teacher-can-header-icon"
        className="cursor-pointer self-end lg:hidden"
        onClick={handleClick}
        size="20px"
      />
    </header>
  );
}
