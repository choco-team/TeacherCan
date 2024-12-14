import { useState, type ChangeEvent } from 'react';
import { SquareIcon, PlayIcon, PauseIcon, RotateCcwIcon } from 'lucide-react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Heading1 } from '@/components/heading';
import { cn } from '@/styles/utils';
import {
  useCountdownAction,
  useCountdownState,
} from '../countdown-provider/countdown-provider.hooks';
import {
  HOUR_TO_SECONDS,
  MAX_TIME,
  MAX_TIME_INPUT,
  MINUTE_TO_SECONDS,
  NO_TIME,
} from '../countdown-provider/countdown-provider.constants';
import Colon from './colon';
import CountdownStepper from '../countdown-components/countdown-stepper';

const timerButtonClassName =
  'size-10 max-md:p-1.5 md:size-16 lg:size-32 rounded-full';
const timerButtonIconClassName = 'size-6 md:size-12 lg:size-20 fill-inherit';

const TIMER_NAME_MAX_LENGTH = 20;

export default function CountdownDisplay() {
  const [timerName, setTimerName] = useState('');

  const { hours, minutes, seconds, setupTime, leftTime, isActive } =
    useCountdownState();
  const {
    updateHours,
    updateMinutes,
    updateSeconds,
    handleStart,
    handlePause,
    handleStop,
    handleReset,
  } = useCountdownAction();

  const shouldRenderHours = hours > 0;
  // NOTE:(김홍동) 타이머가 동작하지 않을 땐 시간은 항상 보이기
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const shouldRenderHoursV2 = !isActive || hours > 0;

  const handleChangeTimerName = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.length > TIMER_NAME_MAX_LENGTH) return;
    setTimerName(value);
  };

  return (
    <div className="flex flex-col items-center gap-y-4 lg:gap-y-12 px-6 lg:px-8 pt-8 md:pt-4 lg:pt-12 pb-4 md:pb-12 lg:pb-20 w-full">
      {isActive ? (
        <Heading1 className="max-md:hidden pt-3 lg:pt-5 h-16 lg:h-28 text-4xl lg:text-7xl">
          {timerName}
        </Heading1>
      ) : (
        <Input
          type="text"
          value={timerName}
          maxLength={TIMER_NAME_MAX_LENGTH}
          readOnly={isActive}
          placeholder="타이머 이름"
          className="max-md:hidden max-w-sm md:max-w-xl lg:max-w-7xl h-16 lg:h-28 text-4xl lg:text-7xl rounded-xl lg:rounded-2xl text-center font-extrabold"
          onChange={handleChangeTimerName}
        />
      )}

      <div className="flex flex-col items-center gap-y-2 lg:gap-y-8">
        <div className="flex items-center gap-x-1 md:gap-x-2 lg:gap-x-4">
          {shouldRenderHours && (
            <>
              <CountdownStepper
                value={hours}
                isActive={isActive}
                disabledUp={leftTime >= MAX_TIME_INPUT.HOUR * 60 * 60}
                disabledDown={leftTime < HOUR_TO_SECONDS}
                length={1}
                className="max-w-20 md:max-w-40 lg:max-w-60"
                onIncrease={() => updateHours(1, true)}
                onDecrease={() => updateHours(-1, true)}
                onChange={(value) => updateHours(value)}
              />
              <Colon />
            </>
          )}
          <CountdownStepper
            value={minutes}
            isActive={isActive}
            disabledUp={
              leftTime >=
              MAX_TIME_INPUT.HOUR * 60 * 60 + MAX_TIME_INPUT.MINUTE * 60
            }
            disabledDown={leftTime <= MINUTE_TO_SECONDS}
            onIncrease={() => updateMinutes(1, true)}
            onDecrease={() => updateMinutes(-1, true)}
            onChange={(value) => updateMinutes(value)}
          />
          <Colon />
          <CountdownStepper
            value={seconds}
            isActive={isActive}
            disabledUp={leftTime >= MAX_TIME}
            disabledDown={leftTime <= NO_TIME}
            onIncrease={() => updateSeconds(1, true)}
            onDecrease={() => updateSeconds(-1, true)}
            onChange={(value) => updateSeconds(value)}
          />
        </div>

        <div className="flex items-center justify-center gap-x-12 md:gap-x-16 lg:gap-x-28">
          {isActive ? (
            <Button
              variant="primary-ghost"
              className={timerButtonClassName}
              onClick={handlePause}
            >
              <PauseIcon className={timerButtonIconClassName} />
              <span className="sr-only">Pause</span>
            </Button>
          ) : (
            <Button
              variant="primary-ghost"
              className={timerButtonClassName}
              disabled={leftTime <= NO_TIME}
              onClick={handleStart}
            >
              <PlayIcon className={timerButtonIconClassName} />
              <span className="sr-only">Start</span>
            </Button>
          )}

          {setupTime > NO_TIME ? (
            <Button
              variant="primary-ghost"
              className={timerButtonClassName}
              onClick={handleStop}
            >
              <SquareIcon
                className={cn(timerButtonIconClassName, 'scale-90')}
              />
              <span className="sr-only">Stop</span>
            </Button>
          ) : (
            <Button
              variant="primary-ghost"
              className={timerButtonClassName}
              disabled={setupTime === NO_TIME && leftTime === NO_TIME}
              onClick={handleReset}
            >
              <RotateCcwIcon
                className={cn(timerButtonIconClassName, 'fill-none')}
              />
              <span className="sr-only">Reset</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
