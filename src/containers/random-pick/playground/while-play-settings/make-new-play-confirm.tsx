import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/alert-dialog';
import { useRandomPickPlaygroundAction } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

type Props = {
  makeNewPlay: () => void;
};

export function MakeNewPlayConfirm({ makeNewPlay }: Props) {
  const { resetPick } = useRandomPickPlaygroundAction();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-text-title">
          진행 중인 뽑기는 저장되지 않아요
        </AlertDialogTitle>
        <AlertDialogDescription className="text-text-subtitle">
          진행 중인 뽑기를 그만두고 새 뽑기를 만들까요?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>취소</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            resetPick();
            makeNewPlay();
          }}
        >
          확인
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
