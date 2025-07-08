import ReleaseNoteContainer from '@/containers/release-note/release-note-container';

export const metadata = {
  title: '릴리즈 노트',
};

function ReleaseNote({ params }: { params: { id?: string } }) {
  return <ReleaseNoteContainer id={params.id} />;
}

export default ReleaseNote;
