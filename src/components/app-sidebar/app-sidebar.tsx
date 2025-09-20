'use client';

import {
  DATA_PATH_DATA,
  HELP_PATH_DATA,
  MENU_PATH_DATA,
  MENU_ROUTE,
  MenuRoutePath,
} from '@/constants/route';
import { ChevronsLeft, TimerIcon } from 'lucide-react';
import useRecentlyVisited from '@/hooks/use-recently-visited';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import EventIcon from '@/components/event-icon';
import { cn } from '@/styles/utils';
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
import { Badge } from '../badge';

const linkClass =
  'w-full text-sm flex gap-2 items-center px-2 py-1 rounded text-text-subtitle hover:text-text-title hover:bg-bg-secondary hover:cursor-pointer';

export default function AppSidebar() {
  const pathname = usePathname();
  const { updateRecentlyVisited } = useRecentlyVisited(
    pathname as MenuRoutePath,
  );

  const { setOpenMobile, openMobile, isMobile, open, setOpen } = useSidebar();

  const showSidebarIcon = isMobile ? openMobile : open;
  const handleClickSidebarIcon = () => {
    if (isMobile) {
      setOpenMobile(false);
      return;
    }

    setOpen(false);
  };

  const handleClickMenu = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar className="border-none shadow-md">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between gap-1">
            <Link
              onClick={handleClickMenu}
              href={MENU_ROUTE.LANDING}
              className={cn(
                pathname === MENU_ROUTE.LANDING &&
                  'text-text-title bg-bg-secondary dark:bg-gray-950',
                linkClass,
              )}
            >
              <EventIcon width={16} height={16} className="size-4" />
              <span>티처캔</span>
            </Link>
            {showSidebarIcon ? (
              <ChevronsLeft
                onClick={handleClickSidebarIcon}
                size="1.2rem"
                className="cursor-pointer text-text-subtitle"
              />
            ) : null}
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
                  className={linkClass}
                >
                  <TimerIcon size="1rem" />
                  <span>타이머</span>
                </PopupLink>
              </SidebarMenuItem>
              {Object.entries(MENU_PATH_DATA).map(
                ([path, { title, Icon, isNew }]) => {
                  if (path === MENU_ROUTE.TIMER) {
                    return null;
                  }

                  return (
                    <SidebarMenuItem key={path}>
                      <Link
                        onClick={handleClickMenu}
                        href={path}
                        className={cn(
                          pathname.startsWith(path) &&
                            'text-text-title bg-bg-secondary dark:bg-gray-950',
                          linkClass,
                        )}
                      >
                        <Icon size="1rem" />
                        <div className="flex items-center gap-0.5">
                          <span>{title}</span>
                          {isNew && (
                            <Badge
                              size="xs"
                              variant="primary-outline"
                              className="border-0"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </SidebarMenuItem>
                  );
                },
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>데이터 관리</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(DATA_PATH_DATA).map(([path, { title, Icon }]) => (
                <SidebarMenuItem key={path}>
                  <Link
                    onClick={handleClickMenu}
                    href={path}
                    className={`${pathname === path ? 'text-text-title bg-bg-secondary dark:bg-gray-950' : ''} ${linkClass}`}
                  >
                    <Icon size="1rem" />
                    <span>{title}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
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
                      className={`${pathname.startsWith(path) ? 'text-text-title bg-bg-secondary dark:bg-gray-950' : ''} ${linkClass}`}
                    >
                      <Icon size="1rem" />
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
