import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Props {
  handleClickTimerButton: () => void;
}

function MenuList({ handleClickTimerButton }: Props) {
  return (
    <div className="flex gap-x-6">
      <Button size="lg" onClick={handleClickTimerButton}>
        타이머
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
