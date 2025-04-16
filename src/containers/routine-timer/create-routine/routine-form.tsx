'use client';

import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Heading4 } from '@/components/heading';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/card';
import { RoutineItem } from './routine-types';

type Props = {
  routines: RoutineItem[];
  setRoutines: (routines: RoutineItem[]) => void;
  onPrevious: () => void;
  onStart: () => void;
};

type RoutineItemWithId = RoutineItem & { routineId: string };

function RoutineForm({ routines, setRoutines, onPrevious, onStart }: Props) {
  const [routinesWithId, setRoutinesWithId] = useState<RoutineItemWithId[]>([]);

  const generateRoutineId = (index: number) => `routine-${Date.now()}-${index}`;

  useEffect(() => {
    const withIds = routines.map((routine, index) => ({
      ...routine,
      routineId: generateRoutineId(index),
    }));
    setRoutinesWithId(withIds);
  }, [routines]);

  const handleChange = (
    id: string,
    key: keyof RoutineItem,
    value: string | number,
  ) => {
    const index = routinesWithId.findIndex((r) => r.routineId === id);
    if (index === -1) return;

    const updated = [...routinesWithId];
    updated[index] = {
      ...updated[index],
      [key]: key === 'duration' ? Number(value) : value,
    };
    setRoutinesWithId(updated);
    setRoutines(updated.map(({ routineId, ...rest }) => rest));
  };

  const handleAdd = () => {
    const newRoutine = {
      title: '',
      description: '',
      duration: 0,
      music: '',
    };

    const id = generateRoutineId(routinesWithId.length);
    const newRoutineWithId: RoutineItemWithId = {
      ...newRoutine,
      routineId: id,
    };

    const updated = [...routinesWithId, newRoutineWithId];
    setRoutinesWithId(updated);
    setRoutines(updated.map(({ routineId, ...rest }) => rest));
  };

  const handleRemove = (id: string) => {
    const updated = routinesWithId.filter((r) => r.routineId !== id);
    setRoutinesWithId(updated);
    setRoutines(updated.map(({ routineId, ...rest }) => rest));
  };

  return (
    <div className="space-y-6">
      <Heading4 className="text-2xl font-bold">루틴 정보 입력</Heading4>

      {routinesWithId.map((routine, idx) => (
        <Card
          key={routine.routineId}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-xl shadow bg-white relative"
        >
          <button
            type="button"
            onClick={() => handleRemove(routine.routineId)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            aria-label={`활동 ${idx + 1} 삭제`}
          >
            <X size={20} />
          </button>

          <CardContent className="flex flex-wrap md:flex-nowrap gap-4 w-full py-2">
            <div className="flex flex-col gap-1 min-w-[120px]">
              <Input
                placeholder="활동명"
                value={routine.title}
                onChange={(e) =>
                  handleChange(routine.routineId, 'title', e.target.value)
                }
              />
            </div>

            <Input
              placeholder="설명"
              value={routine.description}
              onChange={(e) =>
                handleChange(routine.routineId, 'description', e.target.value)
              }
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="시간(초)"
              value={routine.duration}
              onChange={(e) =>
                handleChange(routine.routineId, 'duration', e.target.value)
              }
              className="w-28"
            />
            <Input
              placeholder="음악 URL 또는 이름"
              value={routine.music}
              onChange={(e) =>
                handleChange(routine.routineId, 'music', e.target.value)
              }
              className="flex-1"
            />
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-4 flex-wrap">
        <Button onClick={handleAdd} variant="primary-outline">
          + 활동 추가하기
        </Button>
        <Button
          onClick={onPrevious}
          variant="primary-outline"
          className="flex-1"
        >
          이전
        </Button>
        <Button onClick={onStart} className="flex-1">
          루틴 시작
        </Button>
      </div>
    </div>
  );
}

export default RoutineForm;
