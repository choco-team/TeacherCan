import AnnouncementContainer from '@/containers/announcement/announcement-container';

export const metadata = {
  title: '공지사항',
  description: '티처캔의 새로운 소식을 전해드려요.',
};

export const revalidate = 3600;

function Announcement({ params }: { params: { id?: string } }) {
  return <AnnouncementContainer id={params.id} />;
}

export default Announcement;
