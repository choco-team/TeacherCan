import { Clock } from 'lucide-react';
import { formatTime } from '../utils/time-formatter';
import { usePlayRoutineContext } from '../hooks/use-play-routine-context';

export default function NextActivities() {
  const { routine, currentIndex } = usePlayRoutineContext();

  if (!routine) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">다음 활동</h3>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {routine.activities
          .slice(currentIndex + 1, currentIndex + 4)
          .map((activity, idx) => (
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

        {currentIndex + 1 >= routine.activities.length && (
          <div className="flex-shrink-0 w-32 h-24 bg-green-100 rounded-lg p-3 flex flex-col justify-between">
            <div className="text-sm font-medium truncate">완료</div>
            <div className="text-xs text-gray-500">마지막 활동입니다</div>
          </div>
        )}
      </div>
    </div>
  );
}
