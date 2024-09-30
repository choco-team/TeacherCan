import { Button } from '@/components/button';
import {
  useCountdownAlarmAction,
  useCountdownAlarmState,
} from '../../countdown-alarm-provider/countdown-alarm-provider.hooks';

const ALARM_TIME = {
  '10분': 600,
  '5분': 300,
  '10초': 10,
  '0초': 0,
};

export default function SettingAlarm() {
  const { alarmTimes } = useCountdownAlarmState();
  const { toggleAlarmTime } = useCountdownAlarmAction();

  return (
    <div>
      <span>종료 알림</span>
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(ALARM_TIME).map(([key, value]) => (
          <Button
            key={key}
            variant={alarmTimes.includes(value) ? 'primary' : 'primary-outline'}
            onClick={() => toggleAlarmTime(value)}
          >
            {key}
          </Button>
        ))}
      </div>
    </div>
  );
}
