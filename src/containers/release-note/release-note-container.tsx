import ReleaseNoteDetail from './release-note-detail/release-note-detail';
import ReleaseNoteList from './release-note-list/release-note-list';

type Props = {
  id?: string;
};

export default async function ReleaseNoteContainer({ id }: Props) {
  if (id) {
    return <ReleaseNoteDetail id={id} />;
  }

  return <ReleaseNoteList />;
}
