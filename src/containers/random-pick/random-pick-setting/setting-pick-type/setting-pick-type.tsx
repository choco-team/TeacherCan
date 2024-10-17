import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';
import { SheetDescription, SheetSubTitle } from '@/components/sheet';
import { BookUserIcon, InfoIcon } from 'lucide-react';
import SettingStudentName from '../setting-student-name/setting-student-name';
import SettingStudentNumber from '../setting-student-number/setting-student-number';
import {
  useRandomPickAction,
  useRandomPickState,
} from '../../random-pick-provider/random-pick-provider.hooks';
import { PICK_TYPES } from '../../random-pick-provider/random-pick-provider.constants';

export default function SettingPickType() {
  const { pickType } = useRandomPickState();
  const { selectPickType } = useRandomPickAction();

  return (
    <div className="flex flex-col gap-y-4">
      <SheetSubTitle>
        <BookUserIcon />
        유형
      </SheetSubTitle>
      <SheetDescription>
        <span className="flex gap-x-1 text-start">
          <InfoIcon className="mt-0.5 size-4 text-secondary" />
          랜덤뽑기 진헹 중에는 변경할 수 없어요.
        </span>
      </SheetDescription>
      <div className="flex items-center gap-2">
        {PICK_TYPES.map(({ type, label }) => (
          <Label key={type} className="flex-1 flex items-center gap-x-1.5">
            <Checkbox
              value={type}
              checked={pickType === type}
              onClick={() => selectPickType(type)}
            />
            {label}
          </Label>
        ))}
      </div>
      {pickType === 'names' ? <SettingStudentName /> : <SettingStudentNumber />}
    </div>
  );
}
