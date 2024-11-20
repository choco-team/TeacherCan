import { useRef, useState, type ChangeEvent, type FocusEvent } from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  SquareIcon,
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
} from 'lucide-react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Heading1 } from '@/components/heading';
import { cn } from '@/styles/utils';
import {
  useCountdownAction,
  useCountdownState,
} from '../countdown-provider/countdown-provider.hooks';
import { InputNumberWithoutSpin } from '../countdown-components/countdown-input';
import {
  MINUTE_TO_SECONDS,
  NO_TIME,
} from '../countdown-provider/countdown-provider.constants';
import Colon from './colon';

const timeInputClassName =
  'px-2 md:px-4 md:pb-2 lg:p-6 pt-4 md:pt-6 lg:pt-10 max-w-32 md:max-w-60 lg:max-w-96 text-7xl md:text-9xl lg:text-[13rem] h-auto md:rounded-2xl lg:rounded-3xl bg-white read-only:border-body read-only:bg-body read-only:pointer-events-none text-end font-medium font-number leading-none md:tracking-wide';
const timerButtonClassName =
  'size-10 max-md:p-1.5 md:size-16 lg:size-32 rounded-full';
const timerButtonIconClassName = 'size-6 md:size-12 lg:size-20 fill-inherit';

const TIMER_NAME_MAX_LENGTH = 20;

const formatTimeToTwoDigits = (time: number) =>
  time.toString().padStart(2, '0');

export default function CountdownDisplay() {
  const [timerName, setTimerName] = useState('');

  const { hours, minutes, seconds, setupTime, leftTime, isActive, isHourUsed } =
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

  const handleChangeTimerName = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.length > TIMER_NAME_MAX_LENGTH) return;
    setTimerName(value);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (isActive) return;
    // eslint-disable-next-line no-param-reassign
    event.target.value = '';
  };

  const handleBlur =
    (time: number, formatter?: (time: number) => string) =>
    (event: FocusEvent<HTMLInputElement>) => {
      // eslint-disable-next-line no-param-reassign
      event.target.value = formatter ? formatter(time) : time.toString();
    };

  const holdInterval = useRef<NodeJS.Timeout | null>(null);
  const startHold = (callback: () => void) => {
    callback();
    holdInterval.current = setInterval(callback, 500);
  };

  const stopHold = () => {
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
      holdInterval.current = null;
    }
  };

  const handleIncreaseMinutes = () => {
    updateMinutes(1, true);
  };

  const handleDecreaseMinutes = () => {
    updateMinutes(-1, true);
  };

  const handleIncreaseSeconds = () => {
    updateSeconds(1, true);
  };

  const handleDecreaseSeconds = () => {
    updateSeconds(-1, true);
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
          {isHourUsed && (
            <>
              <div className="flex flex-col items-center">
                <InputNumberWithoutSpin
                  value={hours}
                  className={cn(
                    timeInputClassName,
                    'max-w-20 md:max-w-40 lg:max-w-60',
                  )}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    updateHours(Math.floor(Number(event.target.value)))
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur(hours)}
                  readOnly={isActive}
                />
              </div>
              <Colon />
            </>
          )}
          <div className="flex flex-col items-center gap-y-1.5 lg:gap-y-4">
            <Button
              size="icon"
              variant="primary-ghost"
              className="max-md:hidden size-6 lg:size-12 rounded-full"
              onMouseDown={() => startHold(handleIncreaseMinutes)}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
            >
              <ChevronUpIcon className="size-5 lg:size-8" />
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
              className="max-md:hidden size-6 lg:size-12 rounded-full"
              disabled={leftTime < MINUTE_TO_SECONDS}
              onMouseDown={() => startHold(handleDecreaseMinutes)}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
            >
              <ChevronDownIcon className="size-5 lg:size-8" />
            </Button>
          </div>
          <Colon />
          <div className="flex flex-col items-center gap-y-1.5 lg:gap-y-4">
            <Button
              size="icon"
              variant="primary-ghost"
              className="max-md:hidden size-6 lg:size-12 rounded-full"
              onMouseDown={() => startHold(handleIncreaseSeconds)}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
            >
              <ChevronUpIcon className="size-5 lg:size-8" />
            </Button>
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
            <Button
              size="icon"
              variant="primary-ghost"
              className="max-md:hidden size-6 lg:size-12 rounded-full"
              disabled={leftTime <= 0}
              onMouseDown={() => startHold(handleDecreaseSeconds)}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
            >
              <ChevronDownIcon className="size-5 lg:size-8" />
            </Button>
          </div>
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
