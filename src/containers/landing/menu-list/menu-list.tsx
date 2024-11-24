import Link from 'next/link';
import { Button } from '@/components/button';
import PopupLink from '@/components/popup-link';
import { getDomainURL } from '@/utils/getDomainURL';
import { ROUTE } from '@/constants/route';

function MenuList() {
  const domainURL = getDomainURL();

  return (
    <div className="flex gap-6 flex-col md:flex-row">
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
      <Button
        size="lg"
        className="bg-green-500 hover:bg-green-400 active:bg-green-600"
        asChild
      >
        <Link href={ROUTE.RANDOM_PICK} target="_blank">
          랜덤뽑기
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
