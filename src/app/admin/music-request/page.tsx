import { notFound } from 'next/navigation';
import AdminMusicRequestContainer from '@/containers/admin/music-request/admin-music-request-container';

export const metadata = {
  title: '음악신청 관리',
};

export const dynamic = 'force-dynamic';

export default function AdminMusicRequestPage() {
  // 미들웨어가 /admin 을 막지만, matcher 설정 실수 등으로 구멍이 생기지 않도록 여기서도 확인한다.
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  return <AdminMusicRequestContainer />;
}
