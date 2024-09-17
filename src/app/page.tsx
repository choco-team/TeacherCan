'use client';

import { Button } from '@/components/ui/button';
import { Heading1, Heading2 } from '@/components/ui/Heading';
import ActiveLink from '@/containers/active-link';

export default function Page() {
  return (
    <div className="inline-flex flex-col gap-y-10 p-8">
      <Heading1 className="text-primary">티처캔</Heading1>
      <Heading2>Hello!</Heading2>
      <ActiveLink href="/timer">
        <Button variant="primary-outline">Timer</Button>
      </ActiveLink>

      <div className="inline-grid grid-cols-3 gap-2">
        <Button>primary</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="red">red</Button>
        <Button variant="primary-outline">primary-outline</Button>
        <Button variant="secondary-outline">secondary-outline</Button>
        <Button variant="gray-outline">gray-outline</Button>
        <Button variant="primary-ghost">primary-ghost</Button>
        <Button variant="primary-link">primary-link</Button>
      </div>
      <div>{'반갑습니다.\n테스트입니다'}</div>
    </div>
  );
}
