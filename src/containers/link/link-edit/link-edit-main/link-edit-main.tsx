'use client';

import { useLinkEditState } from '../link-edit-provider/link-edit-provider.hooks';
import LinkEditForm from './link-edit-form/link-edit-form';
import LinkCard from './link-edit-link-card/link-edit-link-card';

export default function LinkEditMainContainer() {
  const { links } = useLinkEditState();

  return (
    <>
      <LinkEditForm />
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </>
  );
}
