import { Button } from '@/components/button';
import { useCountdownAction } from '../../countdown-provider/countdown-provider.hooks';

const SETTING_TIMES = [5, -5, 10, -10];

export default function SettingTime() {
  const { updateMinutes } = useCountdownAction();

  return (
    <div>
      <span>시간 추가</span>
      <div className="grid grid-cols-2 gap-2">
        {SETTING_TIMES.map((time) => (
          <Button
            value={time}
            key={time}
            variant="primary-outline"
            size="sm"
            onClick={() => updateMinutes(time, true)}
          >
            {time > 0 && '+'}
            {time}분
          </Button>
        ))}
      </div>
    </div>
  );
}
