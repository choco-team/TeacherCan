import { useCallback, useEffect } from 'react';
import { MENU_ROUTE, MenuRoutePath } from '@/constants/route';
import useLocalStorage from './useLocalStorage';

export type RecentlyVisited = { pathname: MenuRoutePath; date: Date }[];

export default function useRecentlyVisited(pathname?: MenuRoutePath) {
  const [recentlyVisited, setRecentlyVisited] =
    useLocalStorage<RecentlyVisited>('recently-visited', []);

  const updateRecentlyVisited = useCallback(
    (_pathname?: MenuRoutePath) => {
      if (!_pathname || _pathname === MENU_ROUTE.LANDING) {
        return;
      }

      setRecentlyVisited((prev) => [
        {
          pathname: _pathname,
          date: new Date(),
        },
        ...prev.filter(({ pathname: p }) => p !== _pathname),
      ]);
    },
    [setRecentlyVisited],
  );

  useEffect(() => {
    updateRecentlyVisited(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return {
    recentlyVisited,
    updateRecentlyVisited,
  };
}
