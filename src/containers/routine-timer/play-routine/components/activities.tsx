import { Clock } from 'lucide-react';
import { formatSecondsToTime } from '../utils/formatter';
import { usePlayRoutineContext } from '../hooks/use-play-routine-context';

export default function Activities() {
  const { routine, currentIndex, jumpToActivity } = usePlayRoutineContext();

  if (!routine) return null;

  return (
    <div className="flex items-center justify-center gap-4 overflow-x-auto pb-4 mt-12">
      {routine.activities.map(({ id, action, time }, idx) => (
        <div
          key={id}
          onClick={() => jumpToActivity(idx)}
          className={`flex-shrink-0 w-32 h-24 rounded-lg p-3 flex flex-col justify-between cursor-pointer transition ${
            idx === currentIndex
              ? 'bg-primary-400 text-white font-bold'
              : 'bg-primary-100 hover:bg-primary-200'
          }`}
        >
          <div className="text-sm font-medium truncate">{action}</div>
          <div className="flex items-center text-xs text-gray-500">
            <Clock size={14} className="mr-1" />
            {formatSecondsToTime(time)}
          </div>
        </div>
      ))}
    </div>
  );
}
