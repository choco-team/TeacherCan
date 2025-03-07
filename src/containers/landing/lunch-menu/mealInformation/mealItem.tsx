import React from 'react';

type MealItemProps = {
  date: string;
  dishes: string;
};

function MealItem({ date, dishes }: MealItemProps) {
  return (
    <div className="min-w-[100px] h-auto border p-1 rounded-lg shadow-sm bg-gray-100">
      <h4 className="font-semibold">{date}</h4>
      <div className="flex flex-row gap-2 flex-wrap">
        {dishes ? (
          dishes.split('<br/>').map((dish) => (
            <span
              key={dish}
              className="text-sm text-gray-700 px-2 py-1 rounded-md leading-none"
            >
              {dish}
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
