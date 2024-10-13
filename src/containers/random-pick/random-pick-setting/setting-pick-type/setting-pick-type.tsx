import { useState } from 'react';
import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';
import { SheetSubTitle } from '@/components/sheet';
import SettingStudentName from '../setting-student-name/setting-student-name';
import SettingStudentNumber from '../setting-student-number/setting-student-number';

const PICK_TYPES = [
  {
    type: 'number',
    label: '번호',
  },
  {
    type: 'name',
    label: '이름',
  },
] as const;

export default function SettingPickType() {
  const [pickType, setPickType] = useState<'number' | 'name'>('number');

  return (
    <div className="flex flex-col gap-y-4">
      <SheetSubTitle>유형 선택</SheetSubTitle>
      <div className="flex items-center gap-2">
        {PICK_TYPES.map(({ type, label }) => (
          <Label key={type} className="flex-1 flex items-center gap-x-1.5">
            <Checkbox
              value={type}
              checked={pickType === type}
              onClick={() => setPickType(type)}
            />
            {label}
          </Label>
        ))}
      </div>
      {pickType === 'name' ? <SettingStudentName /> : <SettingStudentNumber />}
    </div>
  );
}
