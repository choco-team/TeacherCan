import { Button } from '@/components/button';
import { HELP_ROUTE, MENU_ROUTE } from '@/constants/route';
import { CheckCircle, Copy, ExternalLink, InfoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import { Label } from '@/components/label';
import { Input } from '@/components/input';
import { useToast } from '@/hooks/use-toast';

type Props = {
  feedbackId: string;
};

export default function FeedbackResult({ feedbackId }: Props) {
  const { toast } = useToast();

  const router = useRouter();

  const feedbackLink = `https://interesting-sherbet-fe5.notion.site/${feedbackId.split('-').join('')}`;

  const handleClickCopyLink = () => {
    toast({
      title: '클립보드에 복사되어있습니다.',
      variant: 'success',
    });
    navigator.clipboard.writeText(feedbackLink);
  };

  const handleClickFeedbackLink = () => {
    window.open(feedbackLink, '_blank');
  };

  const handleClickNewFeedback = () => {
    router.push(HELP_ROUTE.FEEDBACK);
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
          <DialogDescription className="pt-2">
            소중한 피드백을 남겨주셔서 감사합니다. <br />
            여러분의 의견을 바탕으로 더 나은 서비스를 제공할 수 있도록
            노력하겠습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-[2px]">
          <Label htmlFor="link" className="mb-2">
            피드백 페이지 주소
          </Label>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input id="link" defaultValue={feedbackLink} readOnly />
            </div>
            <Button
              onClick={handleClickCopyLink}
              size="sm"
              variant="gray-outline"
              className="px-3"
            >
              <span className="sr-only">Copy</span>
              <Copy />
            </Button>
            <Button
              onClick={handleClickFeedbackLink}
              size="sm"
              variant="gray-outline"
              className="px-3"
            >
              <span className="sr-only">Copy</span>
              <ExternalLink />
            </Button>
          </div>
          <span className="w-full grid grid-cols-[auto_1fr] gap-x-1 text-start text-sm text-gray-500 mb-2 mt-1">
            <InfoIcon className="mt-0.5 size-4 text-primary" />
            <span>
              피드백 페이지 주소는 이후에 다시 확인할 수 없습니다. 피드백 진행
              상황을 확인하고 싶으시면, 주소를 복사 후 저장해 주세요.
            </span>
          </span>
        </div>
        <DialogFooter>
          <Button onClick={handleClickNewFeedback} variant="primary-outline">
            새로운 피드백 작성하기
          </Button>
          <Button onClick={handleClickMoveHome}>홈으로 이동하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
