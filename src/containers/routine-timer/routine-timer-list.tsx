'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';
import { X } from 'lucide-react';
import { MENU_ROUTE } from '@/constants/route';
import { Routine } from './create-routine/routine-types';
import { getTotalTime } from './routine-timer.utils';
import { ROUTINES_MAX_COUNT } from './routine-timer.constants';

export default function RoutineTimerList(): JSX.Element {
  const router = useRouter();
  const [routines, setRoutines] = useLocalStorage<Routine[]>('routines', []);

  const saveRoutines = (updatedRoutines: Routine[]): void => {
    setRoutines(updatedRoutines);
  };

  const handleAddRoutine = (): void => {
    router.push(`${MENU_ROUTE.ROUTINE_TIMER}/new`);
  };

  const handleDeleteRoutine = (event: React.MouseEvent, id: string): void => {
    event.stopPropagation();

    const updatedRoutines = routines.filter((routine) => routine.id !== id);
    saveRoutines(updatedRoutines);
  };

  const handleClickRoutine = (id: string): void => {
    router.push(`${MENU_ROUTE.ROUTINE_TIMER}/${id}`);
  };

  const displayRoutines = Array.isArray(routines) ? routines : [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">내 루틴 타이머</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayRoutines.map(({ id, title, activities }) => {
          const totalTime = getTotalTime(activities);
          return (
            <div
              key={id}
              onClick={() => handleClickRoutine(id)}
              className="relative border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition"
            >
              <button
                type="button"
                onClick={(event) => handleDeleteRoutine(event, id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-black"
              >
                <X />
              </button>
              <h2 className="font-bold text-lg">{title || '제목 없음'}</h2>
              <p className="text-gray-500">
                총 시간: {Math.floor(totalTime / 60)}분 {totalTime % 60}초
              </p>
              <p className="text-gray-500">활동 수: {activities.length}개</p>
            </div>
          );
        })}

        {displayRoutines.length < ROUTINES_MAX_COUNT && (
          <button
            type="button"
            disabled={displayRoutines.length >= ROUTINES_MAX_COUNT}
            onClick={handleAddRoutine}
            className="flex items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition"
          >
            <span className="text-5xl text-gray-400">+</span>
          </button>
        )}
      </div>
    </div>
  );
}
