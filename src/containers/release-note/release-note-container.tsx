import { Suspense } from 'react';
import LoadingSpinner from '@/components/loading-spinner';
import ReleaseNoteDetail from './release-note-detail/release-note-detail';
import ReleaseNoteList from './release-note-list/release-note-list';

type Props = {
  id?: string;
};

export default async function ReleaseNoteContainer({ id }: Props) {
  if (id) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ReleaseNoteDetail id={id} />
      </Suspense>
    );
  }

  return <ReleaseNoteList />;
}
