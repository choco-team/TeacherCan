'use client';

import { Button } from '@/components/button';

const MORE_ANNOUNCEMENT_URL =
  'https://interesting-sherbet-fe5.notion.site/236e6859625a8073b9bddd9e14963cee?v=236e6859625a8064a88e000c89e1232c';

export default function AnnouncementMoreButton() {
  const handleClick = () => {
    window.open(MORE_ANNOUNCEMENT_URL, '_blank');
  };

  return (
    <Button
      variant="primary-link"
      className="mx-auto mt-4"
      size="md"
      onClick={handleClick}
    >
      공지사항 더보기
    </Button>
  );
}
