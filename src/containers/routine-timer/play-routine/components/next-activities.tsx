import { Clock } from 'lucide-react';
import { formatTime } from '../utils/time-formatter';
import { usePlayRoutineContext } from '../hooks/use-play-routine-context';

export default function NextActivities() {
  const { routine, currentIndex } = usePlayRoutineContext();

  if (!routine) return null;

  return (
    <div>
      <div className="flex gap-4 overflow-x-auto pb-4 mt-4">
        {routine.activities.map((activity, idx) => (
          <div
            key={activity.activityKey}
            className="flex-shrink-0 w-32 h-24 bg-primary-100 rounded-lg p-3 flex flex-col justify-between"
          >
            <div className="text-sm font-medium truncate">
              {activity.action || `활동 ${currentIndex + idx + 2}`}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock size={14} className="mr-1" />
              {formatTime(activity.time)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
