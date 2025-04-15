'use client';

import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Heading3, Heading4 } from '@/components/heading';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { RoutineItem } from './routine-types';

interface Props {
  routines: RoutineItem[];
  setRoutines: (routines: RoutineItem[]) => void;
  onPrevious: () => void;
}

type RoutineItemWithId = RoutineItem & { routineId: string };

function RoutineForm({ routines, setRoutines, onPrevious }: Props) {
  const [routinesWithId, setRoutinesWithId] = useState<RoutineItemWithId[]>([]);

  useEffect(() => {
    const withIds = routines.map((routine, index) => {
      const existing = routinesWithId[index];
      return {
        ...routine,
        routineId: existing?.routineId ?? `routine-${Date.now()}-${index}`,
      };
    });
    setRoutinesWithId(withIds);
  }, [routines, routinesWithId]);

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
    setRoutines([...routines, newRoutine]);
  };

  const handleRemove = (id: string) => {
    const updated = routinesWithId.filter((r) => r.routineId !== id);
    setRoutinesWithId(updated);
    setRoutines(updated.map(({ routineId, ...rest }) => rest));
  };

  const handleSubmit = () => {};

  return (
    <div className="space-y-6">
      <Heading4 className="text-2xl font-bold">루틴 정보 입력</Heading4>

      {routinesWithId.map((routine, idx) => (
        <div
          key={routine.routineId}
          className="p-4 border rounded shadow-sm flex flex-col space-y-2 bg-white relative"
        >
          <button
            type="button"
            onClick={() => handleRemove(routine.routineId)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            aria-label={`활동 ${idx + 1} 삭제`}
          >
            <X size={20} />
          </button>

          <Heading3 className="font-semibold text-lg">활동 {idx + 1}</Heading3>

          <Input
            placeholder="활동명"
            value={routine.title}
            onChange={(e) =>
              handleChange(routine.routineId, 'title', e.target.value)
            }
          />
          <Input
            placeholder="설명"
            value={routine.description}
            onChange={(e) =>
              handleChange(routine.routineId, 'description', e.target.value)
            }
          />
          <Input
            type="number"
            placeholder="시간 (초)"
            value={routine.duration}
            onChange={(e) =>
              handleChange(routine.routineId, 'duration', e.target.value)
            }
          />
          <Input
            placeholder="음악 URL 또는 이름"
            value={routine.music}
            onChange={(e) =>
              handleChange(routine.routineId, 'music', e.target.value)
            }
          />
        </div>
      ))}
      <div className="flex gap-4">
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
        <Button onClick={handleSubmit} className="flex-1">
          루틴 시작
        </Button>
      </div>
    </div>
  );
}

export default RoutineForm;
