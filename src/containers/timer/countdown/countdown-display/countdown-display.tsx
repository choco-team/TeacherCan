// 구현이 필요한 기능 목록
// [ ] 타이머 숫자 위 아래 화살표 버튼이 있어서 1분씩은 바로 클릭이 가능하다.
// [ ] 60분에서 넘어가면 시간 단위도 생긴다.
// [ ] 최대 9시간 59분까지 가능하다.

import { Button } from '@/components/button';
import { Heading2 } from '@/components/heading';
import { Input } from '@/components/input';
import {
  useCountdownAction,
  useCountdownState,
} from '../countdown-provider/countdown-provider.hooks';

export default function CountdownDisplay() {
  const { minutes, seconds, isActive, isPaused } = useCountdownState();
  const { updateMinutes, updateSeconds, handlePause, handleReset } =
    useCountdownAction();

  const buttonText = isPaused || !isActive ? 'Start' : 'Pause';

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
      <Heading2 className="text-center">Countdown Timer</Heading2>
      <div className="flex items-center justify-center mb-6 space-x-4">
        <Input
          type="number"
          id="minutes"
          value={minutes}
          onChange={(e) => updateMinutes(Number(e.target.value))}
          className="w-1/3 text-right font-bold text-lg"
        />
        <Input
          type="number"
          id="seconds"
          value={seconds}
          onChange={(e) => updateSeconds(Number(e.target.value))}
          className="w-1/3 text-right font-bold text-lg"
        />
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
