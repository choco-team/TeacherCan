import React from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

type MealItemProps = {
  date: string;
  dishes: string[];
  isToday: boolean;
};

function MealItem({ date, dishes, isToday }: MealItemProps) {
  const [allergies] = useLocalStorage<string[]>('allergies', []);
  const safeAllergies = allergies ?? [];

  const formatDish = (dish: string) => {
    const parts = dish.split(/(\d+)/g); // 숫자 기준으로 분리
    return parts.map((part) => {
      if (safeAllergies.includes(part)) {
        return <span className="text-red-500 font-bold">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div
      className={`flex-1 border rounded-md flex flex-col justify-between text-sm
        ${isToday ? 'bg-primary-50' : 'bg-gray-50'}`}
    >
      <h4 className="font-semibold text-center leading-tight my-2">
        {date} <br />
      </h4>

      <div className="flex flex-col gap-1 p-1 flex-grow text-center">
        {dishes.length > 0 ? (
          dishes.map((dish) => (
            <span key={dish} className="text-sm text-gray-700">
              {formatDish(dish)}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-500">식단 정보 없음</span>
        )}
      </div>
    </div>
  );
}

export default MealItem;
