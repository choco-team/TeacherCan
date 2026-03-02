import { Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/styles/utils';
import { formatSecondsToTime } from '../utils/formatter';
import { usePlayRoutineContext } from '../hooks/use-play-routine-context';

export default function Activities() {
  const { routine, currentIndex, jumpToActivity } = usePlayRoutineContext();

  if (!routine) return null;

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex md:flex-col gap-3 md:gap-2 pb-4 md:pb-0">
        {routine.activities.map(({ id, action, time }, idx) => {
          const isActive = idx === currentIndex;
          const isCompleted = idx < currentIndex;

          return (
            <button
              type="button"
              key={id}
              onClick={() => jumpToActivity(idx)}
              className={cn(
                'flex-shrink-0 w-40 md:w-full p-3 rounded-lg transition-all',
                'flex md:flex-row flex-col gap-2 items-start md:items-center',
                'text-left hover:shadow-sm border',
                isActive && 'bg-primary-100 border-primary-300',
                !isActive && 'bg-gray-50 hover:bg-gray-100 border-gray-200',
              )}
            >
              {/* 상태 아이콘 */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle className="size-5 text-green-600" />
                ) : (
                  <div
                    className={cn(
                      'size-5 rounded-full flex items-center justify-center text-xs font-bold',
                      isActive
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-600',
                    )}
                  >
                    {idx + 1}
                  </div>
                )}
              </div>

              {/* 활동 정보 */}
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    'text-sm font-medium mb-1 break-words',
                    isActive && 'font-bold',
                  )}
                >
                  {action}
                </div>
                <div
                  className={cn(
                    'flex items-center text-xs',
                    isActive ? 'text-gray-700' : 'text-gray-500',
                  )}
                >
                  <Clock size={12} className="mr-1" />
                  {formatSecondsToTime(time)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
