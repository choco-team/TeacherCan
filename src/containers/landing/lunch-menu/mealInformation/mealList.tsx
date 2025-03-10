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

function getWeekRange(date: Date) {
  const dayOfWeek = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
  const monday = new Date(date);
  monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // 🔥 월요일 찾기 (일요일이면 6일 전으로)

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4); // 🔥 월요일에서 4일 뒤 = 금요일

  return { start: monday, end: friday };
}

function MealList({ mealData }: MealListProps) {
  const today = new Date();
  const { start, end } = getWeekRange(today);

  const filteredMeals = mealData.filter((meal) => {
    const mealDate = new Date(
      parseInt(meal.MLSV_YMD.slice(0, 4), 10),
      parseInt(meal.MLSV_YMD.slice(4, 6), 10) - 1,
      parseInt(meal.MLSV_YMD.slice(6, 8), 10),
    );

    return mealDate >= start && mealDate <= end; // ✅ 월~금 포함 확인
  });

  return (
    <div className="rounded-xl w-full overflow-x-auto">
      {filteredMeals.length > 0 && (
        <CardContent className="p-2">
          <div className="flex gap-2">
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
