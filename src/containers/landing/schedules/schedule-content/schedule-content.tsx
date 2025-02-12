import { Button } from '@/components/button';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Badge } from '@/components/badge';
import { Dispatch, SetStateAction } from 'react';
import { Skeleton } from '@/components/skeleton';
import { ScheduleType } from '../schedules.types';
import { calculateDays, reshapeSchedule } from './schedule-content.utils';

type Props = {
  schedules: ScheduleType[] | null;
  setScheduleId: Dispatch<SetStateAction<string>>;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export default function ScheduleContent({
  schedules,
  setScheduleId,
  setIsDialogOpen,
}: Props) {
  if (schedules === null) {
    return (
      <div className="bg-white shadow-custom py-4 px-8 rounded-xl w-full h-64 overflow-auto">
        <div className="flex gap-4">
          <Skeleton className="w-36 h-6" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-60 h-6" />
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <Skeleton className="w-36 h-6" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-60 h-6" />
          </div>
        </div>
      </div>
    );
  }

  const hasSchedule = schedules.length > 0;
  const reshapedSchedule = reshapeSchedule(schedules);

  return (
    <div className="bg-white shadow-custom py-4 px-8 rounded-xl w-full h-64 overflow-auto">
      {hasSchedule ? (
        <div className="flex flex-col gap-8">
          {reshapedSchedule.map(([date, _schedules]) => (
            <div
              key={date}
              className="flex flex-col gap-4 lg:gap-0 lg:flex-row"
            >
              <div className="pt-1 w-full lg:w-[150px] flex flex-row lg:flex-col lg:justify-start justify-between">
                <span className="text-sm text-gray-600">
                  {format(date, 'yy년 MM월 dd일 EEEE', { locale: ko })}
                </span>
                <Badge size="sm" className="w-fit lg:mt-2">
                  {calculateDays(new Date(date))}
                </Badge>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                {_schedules.map((schedule) => (
                  <div
                    onClick={() => {
                      setScheduleId(schedule.id);
                      setIsDialogOpen(true);
                    }}
                    key={schedule.id}
                    className="flex gap-2 w-full p-1 transition-all ease-in-out duration-300 hover:bg-gray-100 cursor-pointer rounded-md"
                  >
                    <div className="hidden lg:block min-w-[3px] h-full bg-primary-400 rounded-xl" />
                    <div className="flex-1 lg:px-1 gap-1 flex flex-col w-hull ">
                      <div className="text-sm font-medium">{schedule.name}</div>
                      <div className="text-sm text-gray-600">
                        {schedule.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 h-full justify-center items-center">
          <div className="text-center text-sm text-gray-500">
            등록된 일정이 없어요. 새로운 일정을 추가해 보세요.
            <br />
            여름방학을 등록해 보는 건 어떨까요? 🏖️
          </div>
          <Button
            size="sm"
            variant="primary-outline"
            onClick={() => {
              setScheduleId(null);
              setIsDialogOpen(true);
            }}
          >
            일정 등록하기
          </Button>
        </div>
      )}
    </div>
  );
}
