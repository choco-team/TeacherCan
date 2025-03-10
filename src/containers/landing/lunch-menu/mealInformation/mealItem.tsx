import React from 'react';

type MealItemProps = {
  date: string;
  dishes: string;
};

function MealItem({ date, dishes }: MealItemProps) {
  return (
    <div className="w-[150px] min-h-[180px] border p-2 rounded-lg flex flex-col justify-between bg-gray-100">
      <h4 className="font-semibold mb-2 text-center">{date}</h4>
      <div className="flex flex-col gap-1 flex-grow">
        {dishes ? (
          dishes.split(/<br\/?>|\n/).map((dish) => (
            <span
              key={dish}
              className="text-sm text-gray-700 block rounded-md text-wrap"
            >
              {dish.trim()}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-500 text-center">
            식단 정보 없음
          </span>
        )}
      </div>
    </div>
  );
}

export default MealItem;
