import { Button } from '@/components/button';
import { Heading2 } from '@/components/heading';
import { Input } from '@/components/input';
import {
  useCountdownAction,
  useCountdownState,
} from '../countdown-provider/countdown-provider.hooks';

export default function CountdownDisplay() {
  const { hours, minutes, seconds, isActive, isPaused } = useCountdownState();
  const {
    updateHours,
    updateMinutes,
    updateSeconds,
    handlePause,
    handleReset,
  } = useCountdownAction();

  const buttonText = isPaused || !isActive ? 'Start' : 'Pause';

  const handleIncreaseMinutes = () => {
    updateMinutes(1, true);
  };

  const handleDecreaseMinutes = () => {
    updateMinutes(-1, true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
      <Heading2 className="text-center">Countdown Timer</Heading2>
      <div className="flex items-center justify-center mb-6 space-x-4">
        <div className="flex flex-col items-center">
          {hours >= 1 && (
            <Input
              type="number"
              id="hours"
              value={hours}
              className="w-full max-w-[120px] text-right font-bold text-lg"
              onChange={(e) => updateHours(Math.floor(Number(e.target.value)))}
            />
          )}
        </div>
        <div className="flex flex-col items-center">
          <Button
            onClick={handleIncreaseMinutes}
            variant="primary-ghost"
            className="py-1 px-1 text-icon"
          >
            ▲
          </Button>
          <Input
            type="number"
            id="minutes"
            value={minutes}
            onChange={(e) => updateMinutes(Math.floor(Number(e.target.value)))}
            className="w-full max-w-[120px] text-right font-bold text-lg"
          />
          <Button
            onClick={handleDecreaseMinutes}
            variant="primary-ghost"
            className="py-1 px-1 text-icon"
          >
            ▼
          </Button>
        </div>
        <span className="text-lg font-bold">:</span>
        <div className="flex flex-col items-center">
          <Input
            type="number"
            id="seconds"
            value={seconds}
            onChange={(e) => updateSeconds(Number(e.target.value))}
            className="w-full max-w-[120px] text-right font-bold text-lg"
          />
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={handlePause} variant="primary-outline">
          {buttonText}
        </Button>
        <Button onClick={handleReset} variant="primary-outline">
          Reset
        </Button>
      </div>
    </div>
  );
}
