'use client';

import {
  ChevronsLeft,
  ChevronsUp,
  PickaxeIcon,
  QrCodeIcon,
  TimerIcon,
} from 'lucide-react';
import Link from 'next/link';
import PopupLink from '@/components/popup-link';
import { ROUTE, RoutePath } from '@/constants/route';
import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import { usePathname } from 'next/navigation';
import useDevice from '@/hooks/use-device';
import { useLayoutEffect } from 'react';

import useRecentlyVisited from '@/hooks/use-recently-visited';
import KakaoLoginButton from '../AuthButton';

const shouldHideHeaderNavigation = ['/timer'];

export default function Navigation() {
  const pathname = usePathname();
  const { updateRecentlyVisited } = useRecentlyVisited(pathname as RoutePath);

  const { isMobile } = useDevice();

  const handelClick = () => {
    const main = document.getElementById('teacher-can-main');
    const navigation = document.getElementById('teacher-can-nav');
    const headerIcon = document.getElementById('teacher-can-header-icon');

    main.setAttribute('data-status', 'closed');
    headerIcon.setAttribute('data-status', 'closed');
    navigation.setAttribute('data-status', 'closed');

    navigation.addEventListener(
      'animationend',
      () => {
        if (navigation.dataset.status === 'closed') {
          navigation.classList.add('hidden');
          navigation.classList.remove('fixed');
        }
      },
      { once: true },
    );
  };

  useLayoutEffect(() => {
    if (!isMobile) {
      return;
    }

    const main = document.getElementById('teacher-can-main');
    const navigation = document.getElementById('teacher-can-nav');
    const headerIcon = document.getElementById('teacher-can-header-icon');

    if (!navigation || navigation.dataset.status === 'closed') {
      return;
    }

    main.setAttribute('data-status', 'closed');
    headerIcon.setAttribute('data-status', 'closed');
    navigation.setAttribute('data-status', 'closed');

    navigation.addEventListener(
      'animationend',
      () => {
        if (navigation.dataset.status === 'closed') {
          navigation.classList.add('hidden');
          navigation.classList.remove('fixed');
        }
      },
      { once: true },
    );
  }, [isMobile]);

  if (shouldHideHeaderNavigation.includes(pathname)) {
    return null;
  }

  return (
    <nav
      id="teacher-can-nav"
      className="overflow-auto fixed z-50 bg-primary-50 px-2 pt-2 shadow-2xl lg:shadow-md pb-4 lg:pb-2 transition ease-in-out data-[status=open]:animate-in data-[status=closed]:animate-out data-[status=closed]:duration-500 data-[status=open]:duration-500 inset-y-0 left-0 h-fit lg:h-full w-full lg:w-[260px] data-[status=closed]:slide-out-to-top lg:data-[status=closed]:[--tw-exit-translate-y:0%!important] lg:data-[status=closed]:slide-out-to-left data-[status=open]:slide-in-from-top lg:data-[status=open]:[--tw-enter-translate-y:0%!important] lg:data-[status=open]:!slide-in-from-left"
    >
      <div className="flex w-full items-center">
        <Link
          onClick={isMobile ? handelClick : null}
          href={ROUTE.LANDING}
          className={`${pathname === ROUTE.LANDING ? 'text-gray-900 bg-primary-200' : ''} w-full text-sm flex gap-4 items-center px-2 py-1 rounded text-gray-700 hover:text-gray-900 hover:bg-primary-200 hover:cursor-pointer transition-all`}
        >
          <TeacherCanLogo width="14" height="14" />
          <span>티처캔</span>
        </Link>
        <ChevronsUp
          color="#3e3e3e"
          className="cursor-pointer mx-2 block lg:hidden"
          onClick={handelClick}
          size="20px"
        />
        <ChevronsLeft
          color="#3e3e3e"
          className="cursor-pointer mx-2 hidden lg:block"
          onClick={handelClick}
          size="20px"
        />
      </div>

      <div className="flex gap-2 w-full justify-center">
        <KakaoLoginButton />{' '}
        {/* 로그인 버튼(카카오 로그인) 컴포넌트 추가, 로그인 상태 점검 로직은 모두 이 컴포넌트 안에서 관리, 필요하다면 이동 */}
      </div>

      <div className="flex gap-2 flex-col mt-6">
        <div className="px-2 text-xs font-medium text-gray-600">메뉴</div>
        <ul className="flex flex-col gap-1">
          <li>
            <PopupLink
              size={7 / 8}
              url={`${ROUTE.TIMER}`}
              onClick={() => updateRecentlyVisited(ROUTE.TIMER)}
              className="w-full text-sm flex gap-4 items-center px-2 py-1 rounded text-gray-700 hover:text-gray-900 hover:bg-primary-200 hover:cursor-pointer transition-all"
            >
              <TimerIcon size="14px" />
              <span>타이머</span>
            </PopupLink>
          </li>
          <li>
            <Link
              onClick={isMobile ? handelClick : null}
              href={ROUTE.QR_CODE}
              className={`${pathname === ROUTE.QR_CODE ? 'text-gray-900 bg-primary-200' : ''} w-full text-sm flex gap-4 items-center px-2 py-1 rounded text-gray-700 hover:text-gray-900 hover:bg-primary-200 hover:cursor-pointer transition-all`}
            >
              <QrCodeIcon size="14px" />
              <span>QR코드</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={isMobile ? handelClick : null}
              href={ROUTE.RANDOM_PICK}
              className={`${pathname === ROUTE.RANDOM_PICK ? 'text-gray-900 bg-primary-200' : ''} w-full text-sm flex gap-4 items-center px-2 py-1 rounded text-gray-700 hover:text-gray-900 hover:bg-primary-200 hover:cursor-pointer transition-all`}
            >
              <PickaxeIcon size="14px" />
              <span>랜덤뽑기</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
