'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Routine } from './create-routine/routine-types';

export default function RoutineTimerList(): JSX.Element {
  const router = useRouter();
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    const loadRoutines = () => {
      try {
        const savedRoutines = localStorage.getItem('routines');
        if (savedRoutines) {
          setRoutines(JSON.parse(savedRoutines));
        }
      } catch (e) {
        console.error('Failed to load routines', e);
        setRoutines([]);
      }
    };
    loadRoutines();
  }, []);

  const saveRoutines = (updatedRoutines: Routine[]) => {
    localStorage.setItem('routines', JSON.stringify(updatedRoutines));
    setRoutines(updatedRoutines);
  };

  function createNewRoutine(): string {
    if (routines.length >= 5) {
      return '';
    }

    const key = uuidv4();
    const newRoutineTimer: Routine = {
      key,
      title: '새 루틴',
      totalTime: 0,
      routine: [],
    };

    const updatedRoutines = [...routines, newRoutineTimer];
    saveRoutines(updatedRoutines);
    return key;
  }

  function handleAddRoutine(): void {
    const newKey = createNewRoutine();
    if (newKey) {
      router.push(`/routine-timer/${newKey}`);
    }
  }

  function handleRoutineClick(key: string): void {
    router.push(`/routine-timer/${key}`);
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">내 루틴 타이머</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {routines.map((routine) => (
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
            <p className="text-gray-500">활동 수: {routine.routine.length}개</p>
          </div>
        ))}

        {routines.length < 5 && (
          <div
            onClick={handleAddRoutine}
            className="flex items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition"
          >
            <span className="text-5xl text-gray-400">+</span>
          </div>
        )}
      </div>
    </div>
  );
}
