import { Suspense } from 'react';
import LoadingSpinner from '@/components/loading-spinner';
import AnnouncementDetail from './announcement-detail/announcement-detail';
import AnnouncementNoteList from './announcement-list/announcement-list';

type Props = {
  id?: string;
};

export default async function AnnouncementContainer({ id }: Props) {
  if (id) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AnnouncementDetail id={id} />
      </Suspense>
    );
  }

  return <AnnouncementNoteList />;
}
