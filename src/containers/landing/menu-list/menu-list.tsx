import Link from 'next/link';
import { Button } from '@/components/button';
import PopupLink from '@/components/popup-link';
import { getDomainURL } from '@/utils/getDomainURL';

function MenuList() {
  return (
    <div className="flex gap-x-6">
      <Button size="lg" variant="primary-outline" asChild>
        <PopupLink size={6 / 7} url={`${getDomainURL()}/timer`}>
          타이머
        </PopupLink>
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
