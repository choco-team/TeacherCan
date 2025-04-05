import PopupLink from '@/components/popup-link';
import { MENU_ROUTE, MenuRoutePath } from '@/constants/route';
import Link from 'next/link';

import { ReactNode } from 'react';

type Props = {
  className: string;
  pathname: MenuRoutePath;
  children: ReactNode;
  updateRecentlyVisited: (_pathname?: MenuRoutePath) => void;
};

export default function LinkCard({
  pathname,
  children,
  className,
  updateRecentlyVisited,
}: Props) {
  if (pathname === MENU_ROUTE.TIMER) {
    return (
      <PopupLink
        size={7 / 8}
        url={`${MENU_ROUTE.TIMER}`}
        onClick={() => updateRecentlyVisited(MENU_ROUTE.TIMER)}
        className={className}
      >
        {children}
      </PopupLink>
    );
  }

  return (
    <Link href={pathname} className={className}>
      {children}
    </Link>
  );
}
