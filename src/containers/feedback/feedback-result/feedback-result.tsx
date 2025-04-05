import { Button } from '@/components/button';
import { HELP_ROUTE, MENU_ROUTE } from '@/constants/route';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';

export default function FeedbackResult() {
  const router = useRouter();

  const handleClickNewFeedback = () => {
    window.location.href = HELP_ROUTE.FEEDBACK;
  };

  const handleClickMoveHome = () => {
    router.push(MENU_ROUTE.LANDING);
  };

  return (
    <Dialog open>
      <DialogContent className="max-w-sm lg:max-w-lg" hideCloseButton>
        <DialogHeader className="">
          <DialogTitle className="flex gap-2 items-center">
            <CheckCircle color="green" />
            <span className="text-green-700">피드백 요청 성공</span>
          </DialogTitle>
          <DialogDescription className="pt-2 text-start">
            소중한 피드백을 남겨주셔서 감사합니다. <br />
            선생님의 의견을 바탕으로 더 나은 서비스를 제공할 수 있도록
            노력하겠습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 lg:gap-1 mt-4">
          <Button onClick={handleClickNewFeedback} variant="primary-outline">
            새로운 피드백 작성하기
          </Button>
          <Button onClick={handleClickMoveHome}>홈으로 이동하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
