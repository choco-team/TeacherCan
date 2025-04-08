import React from 'react';
import { CardContent } from '@/components/card';
import { cn } from '@/styles/utils';
import MealItem from './mealItem';

type MealListProps = {
  mealData: { mlsvYmd: string; dishes: string[]; formattedDate: string }[];
};

function MealList({ mealData }: MealListProps) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  return (
    <CardContent
      className={cn(
        'h-full grid grid-cols-2 gap-3 px-4 pb-0',
        'sm:grid-cols-3',
        'lg:grid-cols-5',
      )}
    >
      {mealData.map((meal) => (
        <MealItem
          key={meal.formattedDate}
          date={meal.formattedDate}
          dishes={meal.dishes}
          isToday={meal.mlsvYmd === today}
        />
      ))}
    </CardContent>
  );
}

export default MealList;
