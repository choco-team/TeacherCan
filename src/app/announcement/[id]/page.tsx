import AnnouncementContainer from '@/containers/announcement/announcement-container';

export const metadata = {
  title: '릴리즈 노트',
};

function Announcement({ params }: { params: { id?: string } }) {
  return <AnnouncementContainer id={params.id} />;
}

export default Announcement;
