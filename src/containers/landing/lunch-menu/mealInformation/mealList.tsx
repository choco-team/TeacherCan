import React from 'react';
import { CardContent } from '@/components/card';
import MealItem from './mealItem';

type MealListProps = {
  mealData: { MLSV_YMD: string; DDISH_NM: string; formattedDate: string }[];
};

function MealList({ mealData }: MealListProps) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  return (
    <div className="rounded-xl h-full">
      {mealData.length > 0 && (
        <CardContent className="pb-0 px-4">
          <div className="flex gap-2">
            {mealData.map((meal) => (
              <MealItem
                key={meal.formattedDate}
                date={meal.formattedDate}
                dishes={meal.DDISH_NM}
                isToday={meal.MLSV_YMD === today}
              />
            ))}
          </div>
        </CardContent>
      )}
    </div>
  );
}

export default MealList;
