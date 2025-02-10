import { HistoryIcon } from 'lucide-react';
import SectionTitle from '../components/section-title';
import RecentlyVisited from './recently-visited/recently-visited';

export default function History() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionTitle Icon={HistoryIcon} title="최근 방문 페이지" />
      <RecentlyVisited />
    </div>
  );
}
