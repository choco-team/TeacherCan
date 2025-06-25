'use client';

import LinkEditProvider from './link-edit-provider/link-edit-provider';
import LinkEditMainContainer from './link-edit-main/link-edit-main';

type Props = {
  params: {
    linkCode: string;
  };
};

export default function LinkEditContainer({ params }: Props) {
  return (
    <LinkEditProvider code={params.linkCode}>
      <LinkEditMainContainer />
    </LinkEditProvider>
  );
}
