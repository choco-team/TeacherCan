import { SheetSubTitle } from '@/components/sheet';
import { BellRing as BellRingIcon } from 'lucide-react';
import { Checkbox } from '@/components/checkbox';
import { Switch } from '@/components/switch';
import { Label } from '@/components/label';
import {
  useCountdownAlarmAction,
  useCountdownAlarmState,
} from '../../countdown-alarm-provider/countdown-alarm-provider.hooks';
import { useCountdownState } from '../../countdown-provider/countdown-provider.hooks';

const ALARM_TIMES = [60 * 10, 60 * 5, 60 * 1, 10] as const;
const DEFAULT_ALARM_VALUE = 0 as const;

export default function SettingAlarm() {
  const { alarmTimes } = useCountdownAlarmState();
  const { toggleAlarmTime } = useCountdownAlarmAction();
  const { leftTime } = useCountdownState();

  return (
    <div className="flex flex-col gap-y-4">
      <SheetSubTitle>
        <BellRingIcon />
        종료 알림
      </SheetSubTitle>
      <Label className="flex items-center justify-between gap-x-2">
        <span>타이머 종료 시 알림음 울리기</span>
        <Switch
          checked={alarmTimes.includes(DEFAULT_ALARM_VALUE)}
          onClick={toggleAlarmTime(DEFAULT_ALARM_VALUE)}
        />
      </Label>
      <div className="flex flex-col gap-y-2">
        <h4 className="text-text font-semibold">미리 알림</h4>
        <div className="flex gap-x-4">
          {ALARM_TIMES.map((time) => (
            <Label key={time} className="flex-1 flex items-center gap-x-1.5">
              <Checkbox
                value={time}
                checked={alarmTimes.includes(time)}
                disabled={leftTime <= time}
                onClick={toggleAlarmTime(time)}
              />
              {`${time >= 60 ? `${time / 60}분` : `${time}초`} 전`}
            </Label>
          ))}
        </div>
      </div>
    </div>
  );
}
