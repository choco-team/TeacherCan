import AnnouncementContainer from '@/containers/announcement/announcement-container';

export const metadata = {
  title: '공지사항',
  description: '티처캔의 새로운 소식을 전해드려요.',
};

export const dynamic = 'force-static';
export const revalidate = false;

function Announcement() {
  return <AnnouncementContainer />;
}

export default Announcement;
