import { SquareIcon, PlayIcon, PauseIcon, RotateCcwIcon } from 'lucide-react';
import { Button } from '@/components/button';
import { cn } from '@/styles/utils';
import {
  HOUR_TO_SECONDS,
  MAX_TIME,
  MAX_TIME_INPUT,
  MINUTE_TO_SECONDS,
  NO_TIME,
} from '../../../routine-timer.constants';
import Colon from './colon';
import CountdownStepper from './countdown-stepper';
import { usePlayRoutineContext } from '../../hooks/use-play-routine-context';

const timerButtonClassName =
  'size-10 max-md:p-1.5 md:size-16 lg:size-32 rounded-full';
const timerButtonIconClassName = 'size-6 md:size-12 lg:size-20 fill-inherit';

export default function CountdownDisplay() {
  const {
    // routine,
    currentActivity,
    // currentIndex,
    timeLeft,
    // totalProgress,
    isRunning,
    // isPaused,
    startTimer,
    pauseTimer,
    //  resumeTimer,
    stopTimer,
    //  setTimeValue,
    updateHours,
    updateMinutes,
    updateSeconds,
  } = usePlayRoutineContext();

  const hours = Math.floor(timeLeft / HOUR_TO_SECONDS);
  const minutes = Math.floor((timeLeft % HOUR_TO_SECONDS) / MINUTE_TO_SECONDS);
  const seconds = timeLeft % MINUTE_TO_SECONDS;

  return (
    <div className="flex flex-col items-center gap-y-4 lg:gap-y-12 py-6 px-4 w-full">
      <div className="max-md:hidden text-text-title pt-3 lg:pt-5 h-16 lg:h-28 text-4xl font-extrabold lg:text-7xl">
        {currentActivity.action}
      </div>

      <div className="flex flex-col items-center gap-y-2 lg:gap-y-8">
        <div className="flex items-center gap-x-1 md:gap-x-2 lg:gap-x-4">
          {currentActivity.time > HOUR_TO_SECONDS && (
            <>
              <CountdownStepper
                value={hours}
                disabledUp={timeLeft >= MAX_TIME_INPUT.HOUR * 60 * 60}
                disabledDown={timeLeft < HOUR_TO_SECONDS}
                length={1}
                className="max-w-20 md:max-w-40 lg:max-w-60"
                target="hour"
                onIncrease={() => updateHours(1, true)}
                onDecrease={() => updateHours(-1, true)}
              />
              <Colon />
            </>
          )}
          <CountdownStepper
            value={minutes}
            disabledUp={
              timeLeft >=
              MAX_TIME_INPUT.HOUR * 60 * 60 + MAX_TIME_INPUT.MINUTE * 60
            }
            disabledDown={timeLeft <= MINUTE_TO_SECONDS}
            target="minute"
            onIncrease={() => updateMinutes(1, true)}
            onDecrease={() => updateMinutes(-1, true)}
          />
          <Colon />
          <CountdownStepper
            value={seconds}
            disabledUp={timeLeft >= MAX_TIME}
            disabledDown={timeLeft <= NO_TIME}
            target="second"
            onIncrease={() => updateSeconds(1, true)}
            onDecrease={() => updateSeconds(-1, true)}
          />
        </div>

        <div className="flex items-center justify-center gap-x-12 md:gap-x-16 lg:gap-x-28 z-10">
          {isRunning ? (
            <Button
              variant="primary-ghost"
              className={timerButtonClassName}
              onClick={pauseTimer}
            >
              <PauseIcon className={timerButtonIconClassName} />
              <span className="sr-only">Pause</span>
            </Button>
          ) : (
            <Button
              variant="primary-ghost"
              className={timerButtonClassName}
              disabled={timeLeft <= NO_TIME}
              onClick={startTimer}
            >
              <PlayIcon className={timerButtonIconClassName} />
              <span className="sr-only">Start</span>
            </Button>
          )}

          {timeLeft > NO_TIME ? (
            <Button
              variant="primary-ghost"
              className={timerButtonClassName}
              onClick={stopTimer}
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
              disabled={timeLeft === NO_TIME}
              onClick={stopTimer}
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
