'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Routine } from './create-routine/routine-types';

export default function RoutineTimerList(): JSX.Element {
  const router = useRouter();
  const [routines, setRoutines] = useLocalStorage<Routine[]>('routines', []);
  const ROUTINES_MAX_COUNT = 5;

  function saveRoutines(updatedRoutines: Routine[]) {
    setRoutines(updatedRoutines);
  }

  function createNewRoutine(): Routine {
    const newRoutineTimer: Routine = {
      key: nanoid(),
      title: '새 루틴',
      totalTime: 0,
      activities: [],
    };

    return newRoutineTimer;
  }

  function handleAddRoutine(): void {
    if (routines.length >= ROUTINES_MAX_COUNT) {
      return;
    }
    const newRoutineTimer = createNewRoutine();
    saveRoutines([...routines, newRoutineTimer]);

    router.push(`/routine-timer/${newRoutineTimer.key}`);
  }

  function handleRoutineClick(key: string): void {
    router.push(`/routine-timer/${key}`);
  }

  const displayRoutines = Array.isArray(routines) ? routines : [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">내 루틴 타이머</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayRoutines.map((routine) => (
          <div
            key={routine.key}
            onClick={() => handleRoutineClick(routine.key)}
            className="border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition"
          >
            <h2 className="font-bold text-lg">
              {routine.title || '제목 없음'}
            </h2>
            <p className="text-gray-500">
              총 시간: {Math.floor(routine.totalTime / 60)}분{' '}
              {routine.totalTime % 60}초
            </p>
            <p className="text-gray-500">
              활동 수: {routine.activities.length}개
            </p>
          </div>
        ))}

        {displayRoutines.length < ROUTINES_MAX_COUNT && (
          <button
            type="button"
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
