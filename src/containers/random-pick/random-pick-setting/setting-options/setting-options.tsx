import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';
import { SheetDescription, SheetSubTitle } from '@/components/sheet';
import { Switch } from '@/components/switch';
import { InfoIcon, Settings2Icon } from 'lucide-react';
import { SORT_SELECTED_STUDENT_TYPES } from '../../random-pick-provider/random-pick-provider.constants';
import {
  useRandomPickAction,
  useRandomPickState,
} from '../../random-pick-provider/random-pick-provider.hooks';

export default function SettingOptions() {
  const {
    options: { isExcludingSelected, isHideResult, sortSelectedStudent },
  } = useRandomPickState();
  const { changeOption } = useRandomPickAction();

  return (
    <div className="flex flex-col gap-y-4">
      <SheetSubTitle>
        <Settings2Icon />
        옵션
      </SheetSubTitle>
      <SheetDescription>
        <span className="flex gap-x-1 text-start">
          <InfoIcon className="mt-0.5 size-4 text-secondary" />
          랜덤뽑기 진헹 중에도 변경할 수 있어요.
        </span>
      </SheetDescription>
      <Label className="flex items-center justify-between">
        <span>결과 숨기기</span>
        <Switch
          checked={isHideResult}
          onClick={() =>
            changeOption((prev) => ({
              isHideResult: !prev.isHideResult,
            }))
          }
        />
      </Label>
      <Label className="flex items-center justify-between">
        <span>뽑힌 학생 제외</span>
        <Switch
          checked={isExcludingSelected}
          onClick={() =>
            changeOption((prev) => ({
              isExcludingSelected: !prev.isExcludingSelected,
            }))
          }
        />
      </Label>
      <div className="flex flex-col gap-y-3">
        <span className="text-sm">뽑힌 학생 정렬</span>
        <div className="max-sm:grid grid-cols-2 sm:flex items-center gap-2">
          {SORT_SELECTED_STUDENT_TYPES.map(({ type, label }) => (
            <Label key={type} className="flex-1 flex items-center gap-x-1.5">
              <Checkbox
                checked={sortSelectedStudent === type}
                onClick={() =>
                  changeOption(() => ({
                    sortSelectedStudent: type,
                  }))
                }
              />
              {label}
            </Label>
          ))}
        </div>
      </div>
    </div>
  );
}
