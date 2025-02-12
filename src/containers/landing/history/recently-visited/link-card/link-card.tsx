import PopupLink from '@/components/popup-link';
import { ROUTE, RoutePath } from '@/constants/route';
import Link from 'next/link';

import { ReactNode } from 'react';

type Props = {
  className: string;
  pathname: RoutePath;
  children: ReactNode;
  updateRecentlyVisited: (_pathname?: RoutePath) => void;
};

export default function LinkCard({
  pathname,
  children,
  className,
  updateRecentlyVisited,
}: Props) {
  if (pathname === ROUTE.TIMER) {
    return (
      <PopupLink
        size={7 / 8}
        url={`${ROUTE.TIMER}`}
        onClick={() => updateRecentlyVisited(ROUTE.TIMER)}
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
