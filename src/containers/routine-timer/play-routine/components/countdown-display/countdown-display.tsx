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

export default function CountdownDisplay() {
  const {
    currentActivity,
    timeLeft,
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
      </div>
    </div>
  );
}
