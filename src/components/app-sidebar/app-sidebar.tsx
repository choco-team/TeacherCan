'use client';

import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import {
  HELP_PATH_DATA,
  MENU_PATH_DATA,
  MENU_ROUTE,
  MenuRoutePath,
} from '@/constants/route';
import { TimerIcon } from 'lucide-react';
import useRecentlyVisited from '@/hooks/use-recently-visited';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import PopupLink from '../popup-link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '../sidebar';

export default function AppSidebar() {
  const pathname = usePathname();
  const { updateRecentlyVisited } = useRecentlyVisited(
    pathname as MenuRoutePath,
  );
  const { setOpenMobile } = useSidebar();

  const handleClickMenu = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar className="border-none shadow-md">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              onClick={handleClickMenu}
              href={MENU_ROUTE.LANDING}
              className={`${pathname === MENU_ROUTE.LANDING ? 'text-gray-900 bg-primary-200' : ''} w-full text-sm flex gap-4 items-center px-2 py-1 rounded text-gray-700 hover:text-gray-900 hover:bg-primary-200 hover:cursor-pointer transition-all`}
            >
              <TeacherCanLogo width="14" height="14" />
              <span>티처캔</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <PopupLink
                  size={7 / 8}
                  url={`${MENU_ROUTE.TIMER}`}
                  onClick={() => updateRecentlyVisited(MENU_ROUTE.TIMER)}
                  className="w-full text-sm flex gap-4 items-center px-2 py-1 rounded text-gray-700 hover:text-gray-900 hover:bg-primary-200 hover:cursor-pointer transition-all"
                >
                  <TimerIcon size="14px" />
                  <span>타이머</span>
                </PopupLink>
              </SidebarMenuItem>
              {Object.entries(MENU_PATH_DATA).map(([path, { title, Icon }]) => {
                if (path === MENU_ROUTE.TIMER) {
                  return null;
                }

                return (
                  <SidebarMenuItem
                    key={path}
                    className="flex gap-1 items-center"
                  >
                    <Link
                      onClick={handleClickMenu}
                      href={path}
                      className={`${pathname === path ? 'text-gray-900 bg-primary-200' : ''} w-full text-sm flex gap-4 items-center px-2 py-1 rounded text-gray-700 hover:text-gray-900 hover:bg-primary-200 hover:cursor-pointer transition-all`}
                    >
                      <Icon size="14px" />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>도움</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(HELP_PATH_DATA).map(([path, { title, Icon }]) => {
                if (path === MENU_ROUTE.TIMER) {
                  return null;
                }

                return (
                  <SidebarMenuItem key={path}>
                    <Link
                      onClick={handleClickMenu}
                      href={path}
                      className={`${pathname === path ? 'text-gray-900 bg-primary-200' : ''} w-full text-sm flex gap-4 items-center px-2 py-1 rounded text-gray-700 hover:text-gray-900 hover:bg-primary-200 hover:cursor-pointer transition-all`}
                    >
                      <Icon size="14px" />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
