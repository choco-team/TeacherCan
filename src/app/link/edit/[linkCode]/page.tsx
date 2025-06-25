import LinkEditContainer from '@/containers/link/link-edit/link-edit-container';

export const metadata = {
  title: '링크모음',
};

function LinkEdit({
  params,
}: {
  params: {
    linkCode: string;
  };
}) {
  return <LinkEditContainer params={params} />;
}

export default LinkEdit;
