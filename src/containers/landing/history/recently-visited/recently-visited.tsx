'use client';

import { PATH_DATA } from '@/constants/route';
import useRecentlyVisited from '@/hooks/use-recently-visited';
import { ClockIcon } from 'lucide-react';
import { Skeleton } from '@/components/skeleton';
import { getElapsedTime } from './recently-visited.utils';
import LinkCard from './link-card/link-card';

export default function RecentlyVisited() {
  const { recentlyVisited, updateRecentlyVisited } = useRecentlyVisited();

  if (!recentlyVisited) {
    return (
      <div className="h-[140px] flex gap-3 lg:gap-6 w-full overflow-auto">
        <Skeleton className="h-[140px] w-[140px] rounded-2xl" />
        <Skeleton className="h-[140px] w-[140px] rounded-2xl" />
        <Skeleton className="h-[140px] w-[140px] rounded-2xl" />
      </div>
    );
  }

  if (recentlyVisited.length === 0) {
    return (
      <div className="shadow-custom py-4 px-8 rounded-xl h-[140px] flex gap-3 lg:gap-6 w-full items-center justify-center text-sm  text-gray-500">
        티처캔의 다양한 기능을 경험해 보세요. 최근 방문한 페이지가 여기에
        나타나요.
      </div>
    );
  }

  return (
    <div className="flex gap-3 lg:gap-6 w-full overflow-auto">
      {recentlyVisited.map(({ pathname, date }) => {
        const { title, Icon } = PATH_DATA[pathname];

        return (
          <LinkCard
            key={pathname}
            pathname={pathname}
            className="bg-white flex flex-col p-4 min-w-[140px] h-[140px] rounded-2xl border border-gray-100 cursor-pointer text-gray-700"
            updateRecentlyVisited={updateRecentlyVisited}
          >
            <Icon size={16} />
            <div className="flex-1 mt-2 text-sm">{title}</div>
            <div className="flex items-center self-end gap-1 text-xs text-gray-600">
              <ClockIcon size={10} />
              {getElapsedTime(date)}
            </div>
          </LinkCard>
        );
      })}
    </div>
  );
}
