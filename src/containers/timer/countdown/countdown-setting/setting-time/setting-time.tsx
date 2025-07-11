import {
  AlarmClockPlus as AlarmClockPlusIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
} from 'lucide-react';
import { Button } from '@/components/button';
import DualPanel from '@/components/dual-panel';
import { useCountdownAction } from '../../countdown-provider/countdown-provider.hooks';

const SETTING_TIMES = [0.5, 5, 10, -0.5, -5, -10] as const;

export default function SettingTime() {
  const { updateMinutes } = useCountdownAction();

  return (
    <div className="flex flex-col gap-y-4">
      <DualPanel.SubTitle>
        <AlarmClockPlusIcon />
        시간 증감
      </DualPanel.SubTitle>
      <div className="grid grid-cols-3 gap-2">
        {SETTING_TIMES.map((time) => (
          <Button
            value={time}
            key={time}
            variant={time > 0 ? 'primary-outline' : 'secondary-outline'}
            size="sm"
            className="flex-1 flex items-center gap-x-0.5 [&_svg]:size-4"
            onClick={() => updateMinutes(time, true, true)}
            id={`timer-${time > 0 ? 'increase' : 'decrease'}-${Math.abs(time)}`}
          >
            {time > 0 ? <PlusIcon /> : <MinusIcon />}
            {Math.abs(time) === 0.5
              ? `${Math.abs(time * 60)}초`
              : `${Math.abs(time)}분`}
          </Button>
        ))}
      </div>
    </div>
  );
}
