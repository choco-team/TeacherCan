import Link from 'next/link';
import { Button } from '@/components/button';
import ActiveLink from '@/components/active-link';

function MenuList() {
  return (
    <div className="flex gap-x-6">
      <ActiveLink href="/timer">
        <Button size="lg" variant="primary-outline">
          타이머
        </Button>
      </ActiveLink>

      <Button variant="gray-outline" size="lg" asChild>
        <Link href="https://www.teachercan.com" target="_blank">
          티처캔 v1
        </Link>
      </Button>
    </div>
  );
}

export default MenuList;
