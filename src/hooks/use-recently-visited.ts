import { useCallback, useEffect } from 'react';
import { ROUTE, RoutePath } from '@/constants/route';
import useLocalStorage from './useLocalStorage';

export type RecentlyVisited = { pathname: RoutePath; date: Date }[];

export default function useRecentlyVisited(pathname?: RoutePath) {
  const [recentlyVisited, setRecentlyVisited] =
    useLocalStorage<RecentlyVisited>('recently-visited', []);

  const updateRecentlyVisited = useCallback(
    (_pathname?: RoutePath) => {
      if (!_pathname || _pathname === ROUTE.LANDING) {
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
