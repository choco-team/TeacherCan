import { Button } from '@/components/button';
import {
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
  SkipBackIcon,
} from 'lucide-react';
import ProgressBar from './progress-bar';
import { usePlayRoutineContext } from '../hooks/use-play-routine-context';
import CountdownDisplay from './countdown-display/countdown-display';

const timerButtonClassName =
  'size-8 max-md:p-1.5 md:size-12 lg:size-16 rounded-full';
const timerButtonIconClassName = 'size-6 md:size-8 lg:size-10 fill-inherit';

export default function ActivityDisplay() {
  const {
    currentActivity,
    totalProgress,
    isPaused,
    resumeTimer,
    pauseTimer,
    skipActivity,
    previousActivity,
  } = usePlayRoutineContext();

  if (!currentActivity) return null;

  return (
    <div className="flex flex-col items-center justify-center">
      <CountdownDisplay />

      <ProgressBar progress={totalProgress} />

      <div className="flex items-center gap-x-6">
        <Button
          onClick={previousActivity}
          className={timerButtonClassName}
          variant="primary-outline"
        >
          <SkipBackIcon className={timerButtonIconClassName} />
          <span className="sr-only">Previous</span>
        </Button>

        {isPaused ? (
          <Button onClick={resumeTimer} className={timerButtonClassName}>
            <PlayIcon className={timerButtonIconClassName} />
            <span className="sr-only">Resume</span>
          </Button>
        ) : (
          <Button onClick={pauseTimer} className={timerButtonClassName}>
            <PauseIcon className={timerButtonIconClassName} />
            <span className="sr-only">Pause</span>
          </Button>
        )}

        <Button
          onClick={skipActivity}
          className={timerButtonClassName}
          variant="primary-outline"
        >
          <SkipForwardIcon className={timerButtonIconClassName} />
          <span className="sr-only">Skip</span>
        </Button>
      </div>
    </div>
  );
}
