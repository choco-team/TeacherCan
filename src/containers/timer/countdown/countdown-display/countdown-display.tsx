import type { ChangeEvent, FocusEvent } from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  SquareIcon,
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
} from 'lucide-react';
import { Button } from '@/components/button';
import { Heading2 } from '@/components/heading';
import { cn } from '@/styles/utils';
import {
  useCountdownAction,
  useCountdownState,
} from '../countdown-provider/countdown-provider.hooks';
import CountdownMusic from '../countdown-music/countdown-music';
import { InputNumberWithoutSpin } from '../countdown-components/countdown-input';
import {
  MINUTE_TO_SECONDS,
  NO_TIME,
} from '../countdown-provider/countdown-provider.constants';

const timeInputClassName =
  'max-w-[256px] h-auto rounded-3xl text-end text-[128px] font-bold';
const timerButtonClassName = 'size-32 rounded-full';
const timerButtonIconClassName = 'size-20 fill-inherit';

const formatTimeToTwoDigits = (time: number) =>
  time.toString().padStart(2, '0');

export default function CountdownDisplay() {
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

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    // eslint-disable-next-line no-param-reassign
    event.target.value = '';
  };

  const handleBlur =
    (time: number, formatter?: (time: number) => string) =>
    (event: FocusEvent<HTMLInputElement>) => {
      // eslint-disable-next-line no-param-reassign
      event.target.value = formatter ? formatter(time) : time.toString();
    };

  const handleIncreaseMinutes = () => {
    updateMinutes(1, true);
  };

  const handleDecreaseMinutes = () => {
    updateMinutes(-1, true);
  };

  return (
    <div className="flex flex-col gap-y-10">
      <Heading2 className="text-center">타이머</Heading2>

      <div className="flex items-center gap-x-4">
        <div className="flex flex-col items-center">
          <InputNumberWithoutSpin
            value={hours}
            className={timeInputClassName}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateHours(Math.floor(Number(event.target.value)))
            }
            onFocus={handleFocus}
            onBlur={handleBlur(hours)}
            readOnly={isActive}
          />
        </div>
        <span className="text-lg font-bold">:</span>
        <div className="flex flex-col items-center gap-y-4">
          <Button
            size="icon"
            variant="primary-ghost"
            className="size-12 [&_svg]:size-8 rounded-full"
            onClick={handleIncreaseMinutes}
          >
            <ChevronUpIcon />
          </Button>
          <InputNumberWithoutSpin
            value={formatTimeToTwoDigits(minutes)}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateMinutes(Math.floor(Number(event.target.value)))
            }
            onFocus={handleFocus}
            onBlur={handleBlur(minutes, formatTimeToTwoDigits)}
            className={timeInputClassName}
            readOnly={isActive}
          />
          <Button
            size="icon"
            variant="primary-ghost"
            className="size-12 [&_svg]:size-8 rounded-full"
            disabled={leftTime < MINUTE_TO_SECONDS}
            onClick={handleDecreaseMinutes}
          >
            <ChevronDownIcon />
          </Button>
        </div>
        <span className="text-lg font-bold">:</span>
        <div className="flex flex-col items-center">
          <InputNumberWithoutSpin
            value={formatTimeToTwoDigits(seconds)}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateSeconds(Number(event.target.value))
            }
            onFocus={handleFocus}
            onBlur={handleBlur(seconds, formatTimeToTwoDigits)}
            className={timeInputClassName}
            readOnly={isActive}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-x-28">
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
            <SquareIcon className={cn(timerButtonIconClassName, 'scale-90')} />
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
      <CountdownMusic />
    </div>
  );
}
