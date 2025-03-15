import React from 'react';
import { CardContent } from '@/components/card';
import MealItem from './mealItem';

type MealListProps = {
  mealData: { MLSV_YMD: string; DDISH_NM: string }[];
};

const formatDate = (
  dateStr: string,
): { formatted: string; dayOfWeek: string; isWeekend: boolean } => {
  const year = parseInt(dateStr.slice(0, 4), 10);
  const month = parseInt(dateStr.slice(4, 6), 10) - 1;
  const day = parseInt(dateStr.slice(6, 8), 10);

  const date = new Date(year, month, day);
  const daysOfWeek = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const isWeekend = dayOfWeek === '토요일' || dayOfWeek === '일요일';

  return {
    formatted: `${year}년 ${month + 1}월 ${day}일`,
    dayOfWeek,
    isWeekend,
  };
};

function MealList({ mealData }: MealListProps) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10).replace(/-/g, '');

  return (
    <div className="rounded-xl w-full overflow-x-auto">
      {mealData.length > 0 && (
        <CardContent className="p-2">
          <div className="flex gap-2">
            {mealData.map((meal) => {
              const { formatted, dayOfWeek } = formatDate(meal.MLSV_YMD);
              const isToday = meal.MLSV_YMD === todayStr;

              return (
                <MealItem
                  key={meal.MLSV_YMD}
                  date={formatted}
                  dayOfWeek={dayOfWeek}
                  dishes={meal.DDISH_NM}
                  isToday={isToday}
                />
              );
            })}
          </div>
        </CardContent>
      )}
    </div>
  );
}

export default MealList;
