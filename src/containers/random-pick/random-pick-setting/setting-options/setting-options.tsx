import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';
import { SheetDescription, SheetSubTitle } from '@/components/sheet';
import { Switch } from '@/components/switch';
import { InfoIcon, Settings2Icon } from 'lucide-react';
import { useState } from 'react';

const SORT_SELECTED_STUDENT_TYPES = [
  {
    type: 'none',
    label: '없음',
  },
  {
    type: 'front',
    label: '앞으로',
  },
  {
    type: 'back',
    label: '뒤로',
  },
] as const;

type SortSelectedStudentType =
  (typeof SORT_SELECTED_STUDENT_TYPES)[number]['type'];

export default function SettingOptions() {
  const [isHideResult, setIsHideResult] = useState(true);
  const [isExcludingSelected, setIsExcludingSelected] = useState(true);
  const [sortSelectedStudent, setSortSelectedStudent] =
    useState<SortSelectedStudentType>('none');

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
          onClick={() => setIsHideResult((prev) => !prev)}
        />
      </Label>
      <Label className="flex items-center justify-between">
        <span>뽑힌 학생 제외</span>
        <Switch
          checked={isExcludingSelected}
          onClick={() => setIsExcludingSelected((prev) => !prev)}
        />
      </Label>
      <div className="flex flex-col gap-y-3">
        <span className="text-sm">뽑힌 학생 정렬</span>
        <div className="max-sm:grid grid-cols-2 sm:flex items-center gap-2">
          {SORT_SELECTED_STUDENT_TYPES.map(({ type, label }) => (
            <Label key={type} className="flex-1 flex items-center gap-x-1.5">
              <Checkbox
                checked={sortSelectedStudent === type}
                onClick={() => setSortSelectedStudent(type)}
              />
              {label}
            </Label>
          ))}
        </div>
      </div>
    </div>
  );
}
