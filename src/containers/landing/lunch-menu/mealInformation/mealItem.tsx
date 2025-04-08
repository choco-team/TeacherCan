import React from 'react';
import { TooltipProvider } from '@/components/tooltip';
import { useAllergy } from '../allergy/allergyContext';
import MealAllergy from './meal-allergy';

type MealItemProps = {
  date: string;
  dishes: string[];
  isToday: boolean;
};

function MealItem({ date, dishes, isToday }: MealItemProps) {
  const { allergies } = useAllergy();

  const formatDish = (dish: string) => {
    // 마지막 괄호만 알러지 정보로 취급
    const lastBracketIndex = dish.lastIndexOf('(');
    if (lastBracketIndex === -1) return dish;

    const foodName = dish.slice(0, lastBracketIndex).trim();
    const allergyInfo = dish.slice(lastBracketIndex + 1);

    // 괄호 안의 내용이 숫자와 점(.)으로만 이루어져 있는지 확인
    if (!/^[\d.]+\)$/.test(allergyInfo)) return dish;

    const allergyNumbers = allergyInfo
      .replace(')', '')
      .split('.')
      .map(Number)
      .filter((num) => !Number.isNaN(num));

    return (
      <>
        {foodName}
        <span className="ps-1 inline-flex gap-0.5">
          {allergyNumbers.map((allergyId) => (
            <MealAllergy
              key={`${dish}-${allergyId}`}
              checked={allergies.includes(allergyId)}
              allergyId={allergyId}
            />
          ))}
        </span>
      </>
    );
  };

  return (
    <div
      className={`flex-1 p-2 rounded-xl flex flex-col justify-between text-sm
        ${isToday ? 'bg-primary-50' : 'bg-gray-50'}`}
    >
      <h4 className="font-semibold text-center leading-tight my-2">
        {date} <br />
      </h4>

      <div className="flex flex-col gap-y-1.5 p-1 flex-grow text-center">
        <TooltipProvider>
          {dishes.length > 0 ? (
            dishes.map((dish) => (
              <span key={dish} className="text-sm text-gray-700">
                {formatDish(dish)}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">식단 정보 없음</span>
          )}
        </TooltipProvider>
      </div>
    </div>
  );
}

export default MealItem;
