import { Button } from '@/components/button';
import { Play, Pause, SkipForward } from 'lucide-react';
import { formatTime } from '../utils/time-formatter';
import ProgressBar from './progress-bar';
import { usePlayRoutineContext } from '../hooks/use-play-routine-context';

export default function ActivityDisplay() {
  const {
    currentActivity,
    currentIndex,
    timeLeft,
    totalProgress,
    isPaused,
    resumeTimer,
    pauseTimer,
    skipActivity,
  } = usePlayRoutineContext();

  if (!currentActivity) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h2 className="text-5xl font-bold mb-6">
        {currentActivity.action || `활동 ${currentIndex + 1}`}
      </h2>

      <div className="text-7xl font-bold mb-10">{formatTime(timeLeft)}</div>

      <ProgressBar progress={totalProgress} />

      <div className="flex gap-4">
        {isPaused ? (
          <Button
            onClick={resumeTimer}
            className="bg-green-500 text-white p-4 rounded-full"
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
