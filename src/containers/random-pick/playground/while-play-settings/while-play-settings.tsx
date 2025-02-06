import { Label } from '@/components/label';
import { Switch } from '@/components/switch';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { AlertDialog, AlertDialogTrigger } from '@/components/alert-dialog';
import {
  useRandomPickState,
  useRandomPickAction,
} from '../../random-pick-provider/random-pick-provider.hooks';
import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';
import { MakeNewPlayConfirm } from './make-new-play-confirm';

type Props = {
  title: string;
  setTitle: (title: string) => void;
  makeNewPlay: () => void;
};

const RANDOM_PICK_NAME_MAX_LENGTH = 20;

export default function WhilePlaySettings({
  title,
  setTitle,
  makeNewPlay,
}: Props) {
  const {
    options: { isExcludingSelected, isHideResult, isMixingAnimation },
  } = useRandomPickState();
  const { changeOption } = useRandomPickAction();

  const { isAllStudentsPicked } = useRandomPickPlaygroundState();
  const { resetPick } = useRandomPickPlaygroundAction();

  return (
    <div className="flex items-center gap-x-8">
      <Input
        type="text"
        maxLength={RANDOM_PICK_NAME_MAX_LENGTH}
        placeholder="랜덤뽑기 제목"
        className="max-w-sm"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex-grow flex items-center justify-end gap-x-4">
        <Label className="flex items-center gap-x-2">
          뽑힌 학생 제외
          <Switch
            checked={isExcludingSelected}
            onClick={() =>
              changeOption((prev) => ({
                isExcludingSelected: !prev.isExcludingSelected,
              }))
            }
          />
        </Label>
        <Label className="flex items-center gap-x-2">
          결과 숨기기
          <Switch
            checked={isHideResult}
            onClick={() =>
              changeOption((prev) => ({
                isHideResult: !prev.isHideResult,
              }))
            }
          />
        </Label>
        <Label className="flex items-center gap-x-2">
          카드 섞기 효과
          <Switch
            checked={isMixingAnimation}
            onClick={() =>
              changeOption((prev) => ({
                isMixingAnimation: !prev.isMixingAnimation,
              }))
            }
          />
        </Label>
      </div>

      <div className="flex items-center gap-x-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="gray-outline" size="md">
              새 뽑기 만들기
            </Button>
          </AlertDialogTrigger>
          <MakeNewPlayConfirm makeNewPlay={makeNewPlay} />
        </AlertDialog>
        <Button
          variant={isAllStudentsPicked ? 'primary' : 'primary-outline'}
          size="md"
          onClick={resetPick}
        >
          뽑기 초기화
        </Button>
      </div>
    </div>
  );
}
