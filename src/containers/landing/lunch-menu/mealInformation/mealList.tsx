import React from 'react';
import { CardContent } from '@/components/card';
import MealItem from './mealItem';

interface MealListProps {
  mealData: { MLSV_YMD: string; DDISH_NM: string }[];
}

function MealList({ mealData }: MealListProps) {
  const formatDate = (dateStr: string): string => {
    return `${dateStr.substring(0, 4)}년 ${dateStr.substring(4, 6)}월 ${dateStr.substring(6, 8)}일`;
  };

  return (
    <div className="bg-white shadow-custom py-4 px-8 rounded-xl w-full overflow-auto">
      {mealData.length > 0 && (
        <CardContent className="p-2">
          <div className="flex flex-col gap-2">
            {mealData.map((meal) => (
              <MealItem
                key={meal.MLSV_YMD}
                date={formatDate(meal.MLSV_YMD)}
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
