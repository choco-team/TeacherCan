import React from 'react';
import { CardContent } from '@/components/card';
import MealItem from './mealItem';

type MealListProps = {
  mealData: { MLSV_YMD: string; DDISH_NM: string }[];
};

const formatDate = (
  dateStr: string,
): { formatted: string; isWeekend: boolean } => {
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
    formatted: `${year}년 ${month + 1}월 ${day}일 ${dayOfWeek}`,
    isWeekend,
  };
};

function MealList({ mealData }: MealListProps) {
  const filteredMeals = mealData.filter(
    (meal) => !formatDate(meal.MLSV_YMD).isWeekend,
  );

  return (
    <div className="bg-white shadow-custom py-4 px-8 rounded-xl w-full overflow-auto">
      {filteredMeals.length > 0 && (
        <CardContent className="p-2">
          <div className="flex flex-col gap-2">
            {filteredMeals.map((meal) => (
              <MealItem
                key={meal.MLSV_YMD}
                date={formatDate(meal.MLSV_YMD).formatted}
                dishes={meal.DDISH_NM}
              />
            ))}
          </div>
        </CardContent>
      )}
    </div>
  );
}

export default MealList;
