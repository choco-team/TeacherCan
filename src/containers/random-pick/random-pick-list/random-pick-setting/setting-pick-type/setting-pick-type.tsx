import { Label } from '@/components/label';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { useState, useCallback, memo } from 'react';
import { creatId } from '@/utils/createNanoid';
import useLocalStorage from '@/hooks/useLocalStorage';
import {
  InnerPickListType,
  PickType,
  Student,
} from '@/containers/random-pick/random-pick-type';
import { PICK_TYPES } from '@/containers/random-pick/random-pick-constants';
import SettingStudentName from '../setting-student-name/setting-student-name';
import SettingStudentNumber from '../setting-student-number/setting-student-number';
import SettingStudentData from '../setting-student-data/setting-student-data';

type Props = {
  onCreateRandomPick: (
    pickType: PickType,
    pickList: InnerPickListType[],
  ) => void;
};

const SettingPickType = memo(function SettingPickType({
  onCreateRandomPick,
}: Props) {
  const [pickType, setPickType] = useState<PickType>('numbers');
  const [studentData] = useLocalStorage<Student[]>('student-data', []);

  // 학생 데이터에서 랜덤 픽 항목 생성 함수
  const handleStudentDataGenerate = useCallback(() => {
    if (!studentData || studentData.length === 0) {
      return;
    }

    const pickList: InnerPickListType[] = studentData.map((student) => ({
      id: creatId(),
      value: student.name,
      isPicked: false,
      isUsed: true,
    }));

    onCreateRandomPick('student-data', pickList);
  }, [studentData, onCreateRandomPick]);

  return (
    <div className="flex flex-col gap-y-6">
      <RadioGroup className="flex gap-y-2">
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
      {pickType === 'names' && (
        <SettingStudentName onCreateRandomPick={onCreateRandomPick} />
      )}
      {pickType === 'student-data' && (
        <SettingStudentData
          studentData={studentData}
          onGenerate={handleStudentDataGenerate}
        />
      )}
      {pickType === 'numbers' && (
        <SettingStudentNumber onCreateRandomPick={onCreateRandomPick} />
      )}
    </div>
  );
});

export default SettingPickType;
