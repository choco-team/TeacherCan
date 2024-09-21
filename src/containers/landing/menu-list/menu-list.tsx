import Link from 'next/link';
import { headers } from 'next/headers';

import { Button } from '@/components/button';
import PopupLink from '@/components/popup-link';

function MenuList() {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';

  const currentUrl = `${protocol}://${host}`;

  return (
    <div className="flex gap-x-6">
      <Button size="lg" variant="primary-outline" asChild>
        <PopupLink url={`${currentUrl}/timer`}>타이머</PopupLink>
      </Button>
      <Button variant="gray-outline" size="lg" asChild>
        <Link href="https://www.teachercan.com" target="_blank">
          티처캔 v1
        </Link>
      </Button>
    </div>
  );
}

export default MenuList;
