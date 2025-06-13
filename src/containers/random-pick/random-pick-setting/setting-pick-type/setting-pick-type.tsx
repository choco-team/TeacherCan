import { Label } from '@/components/label';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { useState } from 'react';
import SettingStudentName from '../setting-student-name/setting-student-name';
import SettingStudentNumber from '../setting-student-number/setting-student-number';
import { PICK_TYPES } from '../../random-pick-provider/random-pick-provider.constants';
import {
  PickType,
  InnerPickListType,
} from '../../random-pick-provider/random-pick-provider';

type Props = {
  updateRandomPickList: (
    pickType: PickType,
    pickList: InnerPickListType[],
  ) => void;
};

export default function SettingPickType({ updateRandomPickList }: Props) {
  const [pickType, setPickType] = useState<PickType>('numbers');

  return (
    <div className="flex flex-col gap-y-6">
      <RadioGroup className="self-start flex items-center gap-x-6">
        {PICK_TYPES.map(({ type, label }) => (
          <Label
            key={type}
            className="flex-1 flex items-center gap-x-1.5 text-text-title"
          >
            <RadioGroupItem
              value={type}
              checked={pickType === type}
              onClick={() => setPickType(type)}
            />
            {label}
          </Label>
        ))}
      </RadioGroup>
      {pickType === 'names' ? (
        <SettingStudentName updateRandomPickList={updateRandomPickList} />
      ) : (
        <SettingStudentNumber updateRandomPickList={updateRandomPickList} />
      )}
    </div>
  );
}
