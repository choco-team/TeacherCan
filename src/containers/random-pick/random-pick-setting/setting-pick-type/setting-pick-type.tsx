import { Label } from '@/components/label';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import SettingStudentName from '../setting-student-name/setting-student-name';
import SettingStudentNumber from '../setting-student-number/setting-student-number';
import {
  useRandomPickAction,
  useRandomPickState,
} from '../../random-pick-provider/random-pick-provider.hooks';
import { PICK_TYPES } from '../../random-pick-provider/random-pick-provider.constants';

type Props = {
  startPlay: () => void;
};

export default function SettingPickType({ startPlay }: Props) {
  const { pickType } = useRandomPickState();
  const { selectPickType } = useRandomPickAction();

  return (
    <div className="flex flex-col gap-y-6">
      <RadioGroup className="self-start flex items-center gap-x-6">
        {PICK_TYPES.map(({ type, label }) => (
          <Label key={type} className="flex-1 flex items-center gap-x-1.5">
            <RadioGroupItem
              value={type}
              checked={pickType === type}
              onClick={() => selectPickType(type)}
            />
            {label}
          </Label>
        ))}
      </RadioGroup>
      {pickType === 'names' ? (
        <SettingStudentName startPlay={startPlay} />
      ) : (
        <SettingStudentNumber startPlay={startPlay} />
      )}
    </div>
  );
}
