import Link from 'next/link';
import { Button } from '@/components/button';
import PopupLink from '@/components/popup-link';
import { getDomainURL } from '@/utils/getDomainURL';
import { ROUTE } from '@/constants/route';

function MenuList() {
  const domainURL = getDomainURL();

  return (
    <div className="flex gap-x-6">
      <Button size="lg" variant="primary" asChild>
        <PopupLink size={7 / 8} url={`${domainURL}${ROUTE.TIMER}`}>
          타이머
        </PopupLink>
      </Button>
      <Button size="lg" variant="secondary" asChild>
        <Link href={ROUTE.QR_CODE} target="_blank">
          QR코드
        </Link>
      </Button>
      <Button variant="gray-outline" size="lg" asChild>
        <Link href="https://teacher-browser.netlify.app/" target="_blank">
          티처캔 v1
        </Link>
      </Button>
    </div>
  );
}

export default MenuList;
