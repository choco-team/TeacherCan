'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

type Routine = {
  id: string;
  steps: { title: string; minutes: number }[];
};

export default function RoutineTimerList(): JSX.Element {
  const router = useRouter();

  function createNewRoutine(): string {
    const id = uuidv4();
    const newRoutine: Routine = {
      id,
      steps: [],
    };
    localStorage.setItem(`routine-${id}`, JSON.stringify(newRoutine));
    return id;
  }

  function handleAddRoutine(): void {
    const newId = createNewRoutine();
    router.push(`/routine/${newId}`);
  }

  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        onClick={handleAddRoutine}
        className="flex items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition"
      >
        <span className="text-5xl text-gray-400">+</span>
      </div>
    </div>
  );
}
