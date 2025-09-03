import { Button } from '@/components/button';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
// import { formatTime } from '../utils/formatter';
import ProgressBar from './progress-bar';
import { usePlayRoutineContext } from '../hooks/use-play-routine-context';
import CountdownDisplay from './countdown-display/countdown-display';

export default function ActivityDisplay() {
  const {
    currentActivity,
    // currentIndex,
    // timeLeft,
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
      {/* <h2 className="text-5xl font-bold mb-6">
        {currentActivity.action || `활동 ${currentIndex + 1}`}
      </h2> */}

      <CountdownDisplay />

      <ProgressBar progress={totalProgress} />

      <div className="flex gap-4">
        <Button
          onClick={previousActivity}
          className="bg-blue-500 text-white p-4 rounded-full"
        >
          <SkipBack />
        </Button>
        {isPaused ? (
          <Button
            onClick={resumeTimer}
            className="bg-yellow-500 text-white p-4 rounded-full"
          >
            <Play size={24} />
          </Button>
        ) : (
          <Button
            onClick={pauseTimer}
            className="bg-yellow-500 text-white p-4 rounded-full"
          >
            <Pause size={24} />
          </Button>
        )}

        <Button
          onClick={skipActivity}
          className="bg-blue-500 text-white p-4 rounded-full"
        >
          <SkipForward size={24} />
        </Button>
      </div>
    </div>
  );
}
