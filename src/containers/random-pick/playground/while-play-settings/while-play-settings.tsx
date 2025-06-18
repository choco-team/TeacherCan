import { Label } from '@/components/label';
import { Switch } from '@/components/switch';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

type Props = {
  title: string;
  updateTitle: (title: string) => void;
};

const RANDOM_PICK_NAME_MAX_LENGTH = 20;

export default function WhilePlaySettings({ title, updateTitle }: Props) {
  const { randomPick } = useRandomPickPlaygroundState();
  const winners = randomPick.pickList.filter((item) => item.isPicked);

  const { resetPick, updateOption } = useRandomPickPlaygroundAction();

  return (
    <div className="flex items-center flex-col gap-6 lg:flex-row flex-wrap">
      <Input
        type="text"
        maxLength={RANDOM_PICK_NAME_MAX_LENGTH}
        placeholder="랜덤뽑기 제목"
        className="lg:max-w-[300px]"
        value={title}
        onChange={(e) => updateTitle(e.target.value)}
      />

      <div className="flex-grow flex gap-8 flex-wrap w-full lg:w-fit justify-end">
        <div className="flex-grow flex items-end md:items-center justify-end gap-4 flex-wrap text-text-title">
          <Label className="flex items-center gap-x-2">
            뽑힌 학생 제외
            <Switch
              checked={randomPick.options.isExcludingSelected}
              onClick={() =>
                updateOption({
                  isExcludingSelected: !randomPick.options.isExcludingSelected,
                })
              }
            />
          </Label>
          <Label className="flex items-center gap-x-2">
            결과 숨기기
            <Switch
              checked={randomPick.options.isHideResult}
              onClick={() =>
                updateOption({
                  isHideResult: !randomPick.options.isHideResult,
                })
              }
            />
          </Label>
          <Label className="flex items-center gap-x-2">
            카드 섞기 효과
            <Switch
              checked={randomPick.options.isMixingAnimation}
              onClick={() =>
                updateOption({
                  isMixingAnimation: !randomPick.options.isMixingAnimation,
                })
              }
            />
          </Label>
        </div>

        <div className="flex items-center gap-x-2 md:gap-x-4 w-full md:w-fit">
          <Button
            variant={
              randomPick.pickList.length === winners.length
                ? 'primary'
                : 'primary-outline'
            }
            size="md"
            onClick={resetPick}
            className="flex-1"
          >
            뽑기 초기화
          </Button>
        </div>
      </div>
    </div>
  );
}
