import { useState, type ChangeEvent, type FocusEvent } from 'react';
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
  'p-6 pt-10 max-w-96 h-auto rounded-3xl bg-white read-only:border-body read-only:bg-body read-only:pointer-events-none text-end text-[13rem] font-medium font-number leading-none tracking-wide';
const timerButtonClassName = 'size-32 rounded-full';
const timerButtonIconClassName = 'size-20 fill-inherit';

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

  const handleIncreaseMinutes = () => {
    updateMinutes(1, true);
  };

  const handleDecreaseMinutes = () => {
    updateMinutes(-1, true);
  };

  return (
    <div className="flex flex-col items-center gap-y-12 w-full px-8 pt-12 pb-20">
      {isActive ? (
        <Heading1 className="pt-5 h-28 [&]:text-7xl">{timerName}</Heading1>
      ) : (
        <Input
          type="text"
          value={timerName}
          maxLength={TIMER_NAME_MAX_LENGTH}
          readOnly={isActive}
          placeholder="타이머 이름"
          className="max-w-7xl h-28 rounded-2xl text-center text-7xl font-extrabold"
          onChange={handleChangeTimerName}
        />
      )}

      <div className="flex items-center gap-x-4">
        {isHourUsed && (
          <>
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
            <Colon />
          </>
        )}
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
        <Colon />
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
    </div>
  );
}
