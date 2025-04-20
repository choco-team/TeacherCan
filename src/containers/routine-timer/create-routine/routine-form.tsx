'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/button';

type Routine = {
  key: string;
  title: string;
  totalTime: number;
  routine: Array<{
    order: number;
    action: string;
    time: number;
  }>;
};

type RouteParams = {
  params: {
    id: string;
  };
};

export default function RoutineForm({ params }: RouteParams): JSX.Element {
  const routineId = params.id;

  const [routine, setRoutine] = useState<Routine>({
    key: routineId,
    title: '새 루틴',
    totalTime: 0,
    routine: [],
  });

  useEffect(() => {
    const loadRoutine = () => {
      try {
        const savedRoutines = localStorage.getItem('routines');
        if (savedRoutines) {
          const routines: Routine[] = JSON.parse(savedRoutines);
          const foundRoutine = routines.find((r) => r.key === routineId);

          if (foundRoutine) {
            setRoutine(foundRoutine);
          }
        }
      } catch (e) {
        console.error('루틴을 불러오는데 실패했습니다', e);
      }
    };

    loadRoutine();
  }, [routineId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoutine({
      ...routine,
      title: e.target.value,
    });
  };

  const saveRoutine = () => {
    try {
      const savedRoutines = localStorage.getItem('routines');
      let routines: Routine[] = [];

      if (savedRoutines) {
        routines = JSON.parse(savedRoutines);
        const index = routines.findIndex((r) => r.key === routineId);

        if (index !== -1) {
          routines[index] = routine;
        } else {
          routines.push(routine);
        }
      } else {
        routines = [routine];
      }

      localStorage.setItem('routines', JSON.stringify(routines));
      // alert('루틴 이름이 저장되었습니다.');
    } catch (e) {
      console.error('루틴 저장에 실패했습니다', e);
      // alert('저장에 실패했습니다.');
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={routine.title}
            onChange={handleTitleChange}
            className="text-xl font-bold p-2 w-full bg-gray-200 rounded border-none"
            placeholder="루틴 이름 입력"
          />
          <p className="text-sm text-gray-500 mt-1">
            (총 시간: {routine.totalTime}초)
          </p>
        </div>

        <div>
          <Button
            onClick={saveRoutine}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            저장하기
          </Button>
        </div>
      </div>

      {/* 활동 추가 영역은 여기에 구현할 예정 */}
      <div className="bg-yellow-300 p-4 rounded-lg">
        <p className="text-center text-gray-600">여기에 활동들이 표시됩니다.</p>
      </div>
    </div>
  );
}
